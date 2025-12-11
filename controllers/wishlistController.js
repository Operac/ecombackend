const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Toggle Wishlist Item (Add if not exists, Remove if exists)
exports.toggleWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const parsedUserId = parseInt(userId);
    const parsedProductId = parseInt(productId);

    if (!parsedUserId || !parsedProductId) {
      return res.status(400).json({ success: false, message: "Missing userId or productId" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: parsedUserId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if item is already in wishlist
    const existingItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: parsedUserId,
          productId: parsedProductId,
        },
      },
    });

    if (existingItem) {
      // Remove item
      await prisma.wishlist.delete({
        where: {
          id: existingItem.id,
        },
      });
      return res.status(200).json({ success: true, message: "Removed from wishlist", action: "removed" });
    } else {
      // Add item
      await prisma.wishlist.create({
        data: {
          userId: parsedUserId,
          productId: parsedProductId,
        },
      });
      return res.status(201).json({ success: true, message: "Added to wishlist", action: "added" });
    }
  } catch (error) {
    console.error("Toggle Wishlist Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get User's Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const parsedUserId = parseInt(userId);

    if (!parsedUserId) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: parsedUserId },
      include: {
        Product: true, // Include full product details
      },
    });

    // Flatten structure for easier frontend consumption if desired, or send as is
    // Sending relevant product data
    const products = wishlist.map(item => item.Product);

    return res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: products, 
      count: products.length
    });

  } catch (error) {
    console.error("Get Wishlist Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
