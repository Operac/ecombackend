const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        const userId = req.user.userid; // From auth middleware

        if (!rating || !productId) {
            return res.status(400).json({ success: false, message: "Rating and Product ID are required" });
        }

        const review = await prisma.review.create({
            data: {
                rating: parseInt(rating),
                comment: comment || "",
                userId: parseInt(userId),
                productId: parseInt(productId)
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        // Optionally update product average rating here if needed, 
        // but often better to calculate on read or trigger
        
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await prisma.review.findMany({
            where: { productId: parseInt(productId) },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { createReview, getProductReviews };
