const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* -------------------- ADD TO CART -------------------- */
exports.addToCart = async (req, res) => {
  const { userId, ProductId, color, size, quantity } = req.body;
  const parsedUserId = Number(userId);
  const parsedProductId = Number(ProductId);

  console.log('AddToCart request:', { userId: parsedUserId, ProductId: parsedProductId, color, size, quantity });

  try {
    // 1. Check user cart
    const cart = await prisma.cart.upsert({
      where: {userId: parsedUserId},
      update: {}, 
      create: {userId: parsedUserId}
    });

    console.log('Cart found/created:', cart.id);

    // 3. Validate product
    const product = await prisma.product.findUnique({
      where: { id: parsedProductId }
    });

    if (!product) {
      console.log('Product not found:', parsedProductId);
      return res.status(400).json({
        success: false,
        message: "Product not found"
      });
    }

    console.log('Product found:', product.name);

    // 4. Check if item already exists
    const existingItem = await prisma.productCart.findUnique({
      where: {
        ProductId_CartId: {
          ProductId: parsedProductId,
          CartId: cart.id
        }
      }
    });

    if (existingItem) {
      console.log('Updating existing item');
      // Update quantity instead of rejecting
      const updated = await prisma.productCart.update({
        where: {
          ProductId_CartId: {
            ProductId: parsedProductId,
            CartId: cart.id
          }
        },
        data: {
          quantity: existingItem.quantity + (quantity || 1),
          selectedcolor: color || existingItem.selectedcolor,
          selectedsize: size || existingItem.selectedsize
        }
      });

      return res.status(200).json({
        success: true,
        message: "Item quantity updated in cart",
        data: updated
      });
    }

    console.log('Adding new item to cart');
    // 5. Add item
    const added = await prisma.productCart.create({
      data: {
        ProductId: parsedProductId,
        CartId: cart.id,
        selectedcolor: color || null,
        selectedsize: size || null,
        quantity: quantity || 1
      }
    });

    console.log('Item added successfully:', added);

    return res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: added
    });
  } catch (error) {
    console.error('AddToCart error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};


/* -------------------- UPDATE CART -------------------- */
exports.updateCart = async (req, res) => {
  const { userId, ProductId, selectedsize, selectedcolor, quantity } = req.body;
  const parsedUserId = Number(userId);
  const parsedProductId = Number(ProductId);

  console.log('Update cart request:', { userId: parsedUserId, ProductId: parsedProductId, selectedsize, selectedcolor, quantity });

  try {
    // 1. Validate cart
    const cart = await prisma.cart.findUnique({
      where: { userId: parsedUserId }
    });

    if (!cart) {
      console.log('Cart not found for user:', parsedUserId);
      return res.status(400).json({
        success: false,
        message: "Cart not found"
      });
    }

    console.log('Found cart:', cart.id);

    // 2. Check if item exists
    const cartItem = await prisma.productCart.findUnique({
      where: {
        ProductId_CartId: {
          ProductId: parsedProductId,
          CartId: cart.id
        }
      }
    });

    if (!cartItem) {
      console.log('Item not found in cart:', { ProductId: parsedProductId, CartId: cart.id });
      return res.status(400).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    console.log('Found cart item:', cartItem);

    // 3. Quantity <= 0 means delete item
    if (quantity <= 0) {
      await prisma.productCart.delete({
        where: {
          ProductId_CartId: {
            ProductId: parsedProductId,
            CartId: cart.id
          }
        }
      });

      return res.status(200).json({
        success: true,
        message: "Item removed from cart"
      });
    }

    // 4. Build update payload
    const payload = {};
    if (quantity !== undefined && quantity !== null) payload.quantity = Number(quantity);
    if (selectedsize !== undefined && selectedsize !== null) payload.selectedsize = selectedsize;
    if (selectedcolor !== undefined && selectedcolor !== null) payload.selectedcolor = selectedcolor;

    console.log('Update payload:', payload);

    // 5. Update item
    const updated = await prisma.productCart.update({
      where: {
        ProductId_CartId: {
          ProductId: parsedProductId,
          CartId: cart.id
        }
      },
      data: payload,
      include: { Product: true }
    });

    console.log('Updated successfully:', updated);

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updated
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};


/* -------------------- DELETE ITEM FROM CART -------------------- */
exports.deleteCart = async (req, res) => {
  const { userId } = req.params;
  const { ProductId } = req.body;

  const parsedUserId = Number(userId);
  const parsedProductId = Number(ProductId);

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: parsedUserId }
    });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = await prisma.productCart.findUnique({
      where: {
        ProductId_CartId: {
          ProductId: parsedProductId,
          CartId: cart.id
        }
      }
    });

    if (!item) {
      return res.status(400).json({
        success: false,
        message: "Item not in cart"
      });
    }

    const deleted = await prisma.productCart.delete({
      where: {
        ProductId_CartId: {
          ProductId: parsedProductId,
          CartId: cart.id
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: "Item deleted",
      data: deleted
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* -------------------- CLEAR CART -------------------- */
exports.clearCart = async (req, res) => {
  const { userId } = req.params;
  const parsedUserId = Number(userId);

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: parsedUserId }
    });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found"
      });
    }

    // Delete all items from cart
    await prisma.productCart.deleteMany({
      where: { CartId: cart.id }
    });

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* -------------------- GET USER CART -------------------- */
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  const parsedUserId = Number(userId);

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: parsedUserId },
      include: {
        ProductCart: {
          include: { Product: true }
        }
      }
    });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart retrieved",
      data: cart
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
