const express = require("express");
const router = express.Router();
const { createReview, getProductReviews } = require("../controllers/reviewController");
const { isUser } = require("../middlewares/auth"); // Assuming auth middleware exists

router.post("/createReview", isUser, createReview);
router.get("/getReviews/:productId", getProductReviews);

module.exports = router;
