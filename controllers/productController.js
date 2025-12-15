const { PrismaClient } = require("@prisma/client");
const { uploadToCloudinary } = require("../utility/uploadtoCloudinary");
const prisma = new PrismaClient();

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      currency,
      defaultSize,
      defaultColor,
      sizes,
      colors,
      bestSelling,
      subcategory,
      rating,
      discount,
      oldPrice,
      tags,
      newArrival,
      categoryid,
      quantity,
    } = req.body;

    const parsedCategoryId = parseInt(categoryid);
    const parsedPrice = parseFloat(price);
    const parsedRating = parseFloat(rating);
    const parsedDiscount = parseFloat(discount);
    const parsedOldPrice = parseFloat(oldPrice);
    const parsedQuantity = parseInt(quantity) || 0;
    const parsedBestSelling = bestSelling === "true" || bestSelling === true;
    const parsedNewArrival = newArrival === "true" || newArrival === true;

    // Validate required fields
    const requiredFields = { name, description, price, currency, categoryid };
    for (let [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          success: false,
          message: `Missing ${key}`,
        });
      }
    }

    const existingProduct = await prisma.product.findFirst({
      where: { name, categoryid: parsedCategoryId },
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({ success: false, message: "Product already exists!" });
    }

    let imageUrl = null;
    if (req.file && req.file.buffer) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "image", "Product");
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parsedPrice,
        currency,
        defaultSize,
        defaultColor,
        sizes,
        colors,
        bestSelling: parsedBestSelling,
        subcategory,
        rating: parsedRating,
        discount: parsedDiscount,
        oldPrice: parsedOldPrice,
        tags,
        newArrival: parsedNewArrival,
        categoryid: parsedCategoryId,
        image: imageUrl,
        quantity: parsedQuantity,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};





exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Separate count and findMany for pagination metadata
    const [totalProducts, allProducts] = await Promise.all([
        prisma.product.count(),
        prisma.product.findMany({
            skip: skip,
            take: limit,
            include: {
                category: true
            },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    const formattedProducts = allProducts.map(product => ({
      ...product,
      category: product.category ? product.category.name : null
    }));

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully!",
      data: formattedProducts,
      pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalItems: totalProducts,
          itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("getAllProducts error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error, please try again later!",
      error: error.message
    });
  }
};

exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  try {
    //check if id id missing
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing Product!",
      });
    }

    //find product
    const product = await prisma.product.findUnique({
      where: { id: parsedId },
    });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found!" });
    }

    //return the product
    return res.status(200).json({
      success: true,
      message: "Product retrived successfully!",
      data: product,
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal sever error, please try again later!",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  
  try {
    // Check for existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id: parsedId },
    });

    if (!existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product does not exist in database!",
      });
    }

    // Handle image upload if provided
    let updateData = { ...req.body };
    
    // Parse quantity if it's there
    if (updateData.quantity) {
        updateData.quantity = parseInt(updateData.quantity);
    }
    
    // Parse other numeric fields if they come as strings (common with FormData)
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.rating) updateData.rating = parseFloat(updateData.rating);
    if (updateData.discount) updateData.discount = parseFloat(updateData.discount);
    if (updateData.oldPrice) updateData.oldPrice = parseFloat(updateData.oldPrice);
    if (updateData.categoryid) updateData.categoryid = parseInt(updateData.categoryid);

    if (req.file && req.file.buffer) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, "image", "Product");
      updateData.image = imageUrl;
    }

    // Remove file object from updateData if it exists
    delete updateData.file;

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: parsedId },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error, please try again later!",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  try {
    // Check for existing product by id
    const existingProduct = await prisma.product.findUnique({
      where: { id: parsedId },
    });

    // Check if product exists
    if (!existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product does not exist in database!",
      });
    }

    // Delete the product
    const deletedProduct = await prisma.product.delete({
      where: { id: parsedId },
    });

    if (!deletedProduct) {
      return res.status(400).json({
        success: false,
        message: "Unable to delete product!!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
      data: deletedProduct,
    });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error, please try again later!",
    });
  }
};

