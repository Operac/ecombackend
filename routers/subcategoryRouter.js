const express = require("express");
const router = express.Router();
const { createSubcategory, getAllSubcategories, deleteSubcategory } = require("../controllers/subcategoryController");
const { isUser, isAdmin } = require("../middlewares/auth");

// Should be admin only for CUD
router.post("/subcategory/create", isUser, isAdmin, createSubcategory);
router.get("/subcategory/getAll", getAllSubcategories); // Public or Protect? Public for frontend filtering
router.delete("/subcategory/delete/:id", isUser, isAdmin, deleteSubcategory);

module.exports = router;
