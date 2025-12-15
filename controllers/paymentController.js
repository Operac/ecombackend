const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
exports.initializePayment = async (req, res) => {
  const { email } = req.body;
  const order_id = uuidv4();

  try {
    //get the user
    const user = await prisma.user.findUnique({ where: { email } });

    //check if users does not exist and repond
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist!" });
    }
    

    //Get users cart
    const userCart = await prisma.cart.findUnique({
      where: { userId : parseInt(user.id)},
      include: { ProductCart: { include: { Product: true } } },
    });
    //check if users cart does not exist and repond
    if (!userCart) {
      return res
        .status(400)
        .json({ success: false, message: "User cart does not exist!" });
    }
    const cartItems = userCart.ProductCart;

    // Calculate total price
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item?.Product.price * (item.quantity || 1),
      0
    );

    const payload = {
      tx_ref: uuidv4(),
      amount: totalPrice,
      currency: "NGN",
      redirect_url:
        process.env.FRONTEND_URL,
      // redirect_url: 'https://your-app.com/payment-success', always remember to change

      customer: {
        email: user.email,
        name: user.name,
        phonenumber: user.phone,
      },

      meta: {
        userId: user.id,
        order_id,
      },

      customizations: {
        title: "Grandeur",
        description: "Payment",
      },
    };

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.status !== "success") {
      return res
        .status(500)
        .json({ success: false, message: "Somthing went wrong!" });
    }

    return res.status(201).json({
      success: true,
      message: "Payment initialized successfully!",
      link: data.data.link,
      order_id,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Somthing went wrong!" });
  }
};

exports.verifyPayment = async (req, res) => {
  console.log('start')

  const { transaction_id } = req.query
  // const { order_id, email } = req.body

 

  console.log('Flutterwave redirect data:', req.query)

  if (!transaction_id) {
    return res.status(400).json({ message: 'Missing transaction_id' })
  }

  try {
const response = await fetch(
  `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
    }
  }
)

    const data = await response.json()
    console.log('data:', data)

    const id = Number(data?.data?.meta?.userId)
    console.log('id', id)
    const order_id = data?.data?.meta?.order_id


    const amount = data?.data?.amount
    const status = data?.data?.status

    //Find user
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User does not exist in Database!' })
    }

    //find users cart
    const userCart = await prisma.cart.findUnique({
      where: { userId: id },
      include: { ProductCart: { include: { Product: true } } }
    })

    if (!userCart) {
      return res.status(400).json({
        success: false,
        message: 'User cart does not exist in Database!'
      })
    }

    //check for existing reciept
    const existingReceipt = await prisma.receipt.findUnique({
      where: { orderId: order_id }
    })

    if (existingReceipt) {
      return res
        .status(400)
        .json({ success: false, message: 'Receipt already Exist in Database!' })
    }

    const newReceipt = await prisma.receipt.create({
      data: {
        orderId: order_id,
        userId: id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        amount: amount,
        transactionId: transaction_id,
        status: status
      }
    })

    if (!newReceipt) {
      return res
        .status(400)
        .json({ success: false, message: 'Unable to generate receipt!' })
    }

    const cartItems = await prisma.receiptItem.createMany({
      data: userCart.ProductCart.map(item => ({
        receiptId: newReceipt.id,
        name: item.Product.name,
        price: item.Product.price,
        quantity: item.quantity,
        total: item.quantity * item.Product.price,
        ProductId: item.Product.id,
        image: item.Product.image || null
      }))
    })

    // DECREMENT STOCK
    for (const item of userCart.ProductCart) {
      try {
        await prisma.product.update({
          where: { id: item.Product.id },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      } catch (err) {
        console.error(`Failed to decrement stock for product ${item.Product.id}`, err);
      }
    }

    const updatedReciept = await prisma.receipt.findUnique({
      where: { orderId: order_id },
      include: { receiptItem: true }
    })

    return res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: updatedReciept
    })
  } catch (error) {
    console.log('eror', error.message)

    return res.status(500).json({ error: error.message })
  }
}

exports.getUserReceipts = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const receipts = await prisma.receipt.findMany({
      where: { userId: Number(userId) },
      include: { receiptItem: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      message: "Receipts retrieved successfully",
      data: receipts
    });
  } catch (error) {
    console.error("Get receipts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve receipts"
    });
  }
};

exports.getAllReceipts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [totalReceipts, receipts] = await Promise.all([
        prisma.receipt.count(),
        prisma.receipt.findMany({
            skip: skip,
            take: limit,
            include: { 
                receiptItem: true 
            },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return res.status(200).json({
      success: true,
      message: "All receipts retrieved successfully",
      data: receipts,
      pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReceipts / limit),
          totalItems: totalReceipts,
          itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("Get all receipts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve all receipts"
    });
  }
};

exports.updateReceiptStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedReceipt = await prisma.receipt.update({
      where: { id: Number(id) },
      data: { status },
      include: { receiptItem: true }
    });

    return res.status(200).json({
      success: true,
      message: "Receipt status updated successfully",
      data: updatedReceipt
    });
  } catch (error) {
    console.error("Update receipt status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update receipt status"
    });
  }
};