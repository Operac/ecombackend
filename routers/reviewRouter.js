const express = require("express");
const router = express.Router();
const { createReview, getProductReviews } = require("../controllers/reviewController");
const { authenticate } = require("../middleware/authMiddleware"); // Assuming auth middleware exists

router.post("/createReview", authenticate, createReview);
router.get("/getReviews/:productId", getProductReviews);

module.exports = router;
