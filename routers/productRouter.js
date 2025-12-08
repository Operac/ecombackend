const express = require("express")
const uploads = require("../middlewares/uploads")
const { createProduct, getSingleProduct, getAllProducts, deleteProduct, updateProduct } = require("../controllers/productController");
const { isUser, isAdmin, isSameUser } = require("../middlewares/auth");
const productRouter = express.Router();

/**
 * @swagger
 * /product/createProduct:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with image upload capability (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - currency
 *               - categoryid
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Premium T-Shirt"
 *               description:
 *                 type: string
 *                 example: "High quality cotton t-shirt"
 *               price:
 *                 type: number
 *                 example: 5000
 *               currency:
 *                 type: string
 *                 example: "NGN"
 *               defaultSize:
 *                 type: string
 *                 example: "M"
 *               defaultColor:
 *                 type: string
 *                 example: "Blue"
 *               sizes:
 *                 type: string
 *                 example: "S,M,L,XL"
 *               colors:
 *                 type: string
 *                 example: "Blue,Black,White"
 *               bestSelling:
 *                 type: boolean
 *                 example: true
 *               subcategory:
 *                 type: string
 *                 example: "Casual Wear"
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               discount:
 *                 type: number
 *                 example: 10
 *               oldPrice:
 *                 type: number
 *                 example: 6000
 *               tags:
 *                 type: string
 *                 example: "summer,casual,cotton"
 *               newArrival:
 *                 type: boolean
 *                 example: true
 *               categoryid:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product created successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Premium T-Shirt"
 *                     description:
 *                       type: string
 *                       example: "High quality cotton t-shirt"
 *                     price:
 *                       type: number
 *                       example: 5000
 *                     currency:
 *                       type: string
 *                       example: "NGN"
 *                     defaultSize:
 *                       type: string
 *                       example: "M"
 *                     defaultColor:
 *                       type: string
 *                       example: "Blue"
 *                     sizes:
 *                       type: string
 *                       example: "S,M,L,XL"
 *                     colors:
 *                       type: string
 *                       example: "Blue,Black,White"
 *                     bestSelling:
 *                       type: boolean
 *                       example: true
 *                     subcategory:
 *                       type: string
 *                       example: "Casual Wear"
 *                     rating:
 *                       type: number
 *                       example: 4.5
 *                     discount:
 *                       type: number
 *                       example: 10
 *                     oldPrice:
 *                       type: number
 *                       example: 6000
 *                     tags:
 *                       type: string
 *                       example: "summer,casual,cotton"
 *                     newArrival:
 *                       type: boolean
 *                       example: true
 *                     categoryid:
 *                       type: integer
 *                       example: 1
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: "https://cloudinary.com/image.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Missing required fields or product already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Missing name"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
productRouter.post("/createProduct", isUser, isAdmin, uploads.single("image"), createProduct);

/**
 * @swagger
 * /product/getSingleProduct/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     description: Retrieves a single product using its ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *         example: 1
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product retrived successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Premium T-Shirt"
 *                     description:
 *                       type: string
 *                       example: "High quality cotton t-shirt"
 *                     price:
 *                       type: number
 *                       example: 5000
 *                     currency:
 *                       type: string
 *                       example: "NGN"
 *                     defaultSize:
 *                       type: string
 *                       example: "M"
 *                     defaultColor:
 *                       type: string
 *                       example: "Blue"
 *                     sizes:
 *                       type: string
 *                       example: "S,M,L,XL"
 *                     colors:
 *                       type: string
 *                       example: "Blue,Black,White"
 *                     bestSelling:
 *                       type: boolean
 *                       example: true
 *                     subcategory:
 *                       type: string
 *                       example: "Casual Wear"
 *                     rating:
 *                       type: number
 *                       example: 4.5
 *                     discount:
 *                       type: number
 *                       example: 10
 *                     oldPrice:
 *                       type: number
 *                       example: 6000
 *                     tags:
 *                       type: string
 *                       example: "summer,casual,cotton"
 *                     newArrival:
 *                       type: boolean
 *                       example: true
 *                     categoryid:
 *                       type: integer
 *                       example: 1
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: "https://cloudinary.com/image.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product not found!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal sever error, please try again later!"
 */
productRouter.get("/getSingleProduct/:id", getSingleProduct);

/**
 * @swagger
 * /product/getAllProducts:
 *   get:
 *     summary: Get all products
 *     description: Retrieves all products from the database
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Products retrieved successfully!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Premium T-Shirt"
 *                       description:
 *                         type: string
 *                         example: "High quality cotton t-shirt"
 *                       price:
 *                         type: number
 *                         example: 5000
 *                       currency:
 *                         type: string
 *                         example: "NGN"
 *                       defaultSize:
 *                         type: string
 *                         example: "M"
 *                       defaultColor:
 *                         type: string
 *                         example: "Blue"
 *                       sizes:
 *                         type: string
 *                         example: "S,M,L,XL"
 *                       colors:
 *                         type: string
 *                         example: "Blue,Black,White"
 *                       bestSelling:
 *                         type: boolean
 *                         example: true
 *                       subcategory:
 *                         type: string
 *                         example: "Casual Wear"
 *                       rating:
 *                         type: number
 *                         example: 4.5
 *                       discount:
 *                         type: number
 *                         example: 10
 *                       oldPrice:
 *                         type: number
 *                         example: 6000
 *                       tags:
 *                         type: string
 *                         example: "summer,casual,cotton"
 *                       newArrival:
 *                         type: boolean
 *                         example: true
 *                       categoryid:
 *                         type: integer
 *                         example: 1
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: "https://cloudinary.com/image.jpg"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later!"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
productRouter.get("/getAllProducts", getAllProducts);

/**
 * @swagger
 * /product/updateProduct/{id}:
 *   put:
 *     summary: Update a product
 *     description: Updates an existing product by ID (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated T-Shirt"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               price:
 *                 type: number
 *                 example: 5500
 *               currency:
 *                 type: string
 *                 example: "NGN"
 *               defaultSize:
 *                 type: string
 *                 example: "L"
 *               defaultColor:
 *                 type: string
 *                 example: "Red"
 *               sizes:
 *                 type: string
 *                 example: "S,M,L,XL,XXL"
 *               colors:
 *                 type: string
 *                 example: "Red,Blue,Green"
 *               bestSelling:
 *                 type: boolean
 *                 example: false
 *               subcategory:
 *                 type: string
 *                 example: "Formal Wear"
 *               rating:
 *                 type: number
 *                 example: 4.8
 *               discount:
 *                 type: number
 *                 example: 15
 *               oldPrice:
 *                 type: number
 *                 example: 6500
 *               tags:
 *                 type: string
 *                 example: "winter,formal,premium"
 *               newArrival:
 *                 type: boolean
 *                 example: false
 *               categoryid:
 *                 type: integer
 *                 example: 2
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New product image file (optional)
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product updated successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Updated T-Shirt"
 *                     description:
 *                       type: string
 *                       example: "Updated description"
 *                     price:
 *                       type: number
 *                       example: 5500
 *                     image:
 *                       type: string
 *                       example: "https://cloudinary.com/updated-image.jpg"
 *       400:
 *         description: Bad request - Product does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product does not exist in database!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later!"
 */
productRouter.put("/updateProduct/:id", isAdmin, uploads.single("image"), updateProduct);

/**
 * @swagger
 * /product/deleteProduct/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by ID (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Premium T-Shirt"
 *                     description:
 *                       type: string
 *                       example: "High quality cotton t-shirt"
 *       400:
 *         description: Bad request - Product does not exist or unable to delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product does not exist in database!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later!"
 */
productRouter.delete("/deleteProduct/:id", isAdmin, deleteProduct);
module.exports = productRouter;
