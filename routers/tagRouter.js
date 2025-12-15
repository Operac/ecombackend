const express = require("express");
const router = express.Router();
const { createTag, getAllTags, deleteTag } = require("../controllers/tagController");
const { isUser, isAdmin } = require("../middlewares/auth");

router.post("/tag/create", isUser, isAdmin, createTag);
router.get("/tag/getAll", getAllTags); // Public
router.delete("/tag/delete/:id", isUser, isAdmin, deleteTag);

module.exports = router;
