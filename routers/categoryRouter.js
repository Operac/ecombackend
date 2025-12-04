const express = require("express");
const { createCategory, getSingleCategory, getAllCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const categoryRouter = express.Router();

categoryRouter.post("/createCategory", createCategory);
categoryRouter.get("/getAllCategories", getAllCategory);
categoryRouter.get("/getSingleCategory/:name", getSingleCategory)
categoryRouter.put("/updateCategory/:id", updateCategory);
categoryRouter.delete("/deleteCategory/:id", deleteCategory);

module.exports = categoryRouter;
