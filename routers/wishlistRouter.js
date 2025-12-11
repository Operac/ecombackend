const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

// Use PATCH or POST for toggle. POST is common for "actions".
router.post("/wishlist/toggle", wishlistController.toggleWishlist);
router.get("/wishlist/:userId", wishlistController.getWishlist);

module.exports = router;
