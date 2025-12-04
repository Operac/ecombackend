const express = require("express")
const uploads = require("../middlewares/uploads")
const { createProduct, getSingleProduct, getAllProducts, deleteProduct, updateProduct } = require("../controllers/productController");
const { isUser, isAdmin, isSameUser } = require("../middlewares/auth");
const productRouter = express.Router();

productRouter.post("/createProduct", isUser, isAdmin, uploads.single("image"), createProduct);
productRouter.get("/getSingleProduct/:name", getSingleProduct);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.put("/updateProduct/:id", isAdmin, uploads.single("image"), updateProduct);
productRouter.delete("/deleteProduct/:name", isAdmin, deleteProduct);
module.exports = productRouter;
