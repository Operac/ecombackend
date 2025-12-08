const express = require("express")
const uploads = require("../middlewares/uploads")
const { registerUser, loginUser } = require("../controllers/userController")
const userRouter = express.Router()

userRouter.post("/registeruser", uploads.single("image"), registerUser)
/**
 * @swagger
 * /loginuser:
 *   post:
 *     summary: Login a user and merge guest cart
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecurePassword123
 *               guestCart:
 *                 type: array
 *                 description: Optional guest cart items to merge with user cart
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     color:
 *                       type: string
 *                       example: red
 *                     size:
 *                       type: string
 *                       example: L
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Authorization:
 *             schema:
 *               type: string
 *             description: Bearer token
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
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Product with cart details
 *                 data:
 *                   type: object
 *                   properties:
 *                     userid:
 *                       type: number
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 *                     image:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Bad request - Missing credentials, user not found, or incorrect password
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
 *                   example: Email and Password required!
 *       500:
 *         description: Server error
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
 *                   example: Server error
 */
userRouter.post("/loginuser",  loginUser)


module.exports = userRouter
