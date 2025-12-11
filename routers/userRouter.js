const express = require("express")
const uploads = require("../middlewares/uploads")
const { registerUser, loginUser, verifyEmail } = require("../controllers/userController")
const userRouter = express.Router()

userRouter.get("/verify-email", verifyEmail);

/**
 * @swagger
 * /registeruser:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - address
 *               - password
 *               - confirmpassword
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               address:
 *                 type: string
 *                 example: 123 Main St, New York, NY 10001
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Must start with uppercase letter and include a special character
 *                 example: Password123!
 *               confirmpassword:
 *                 type: string
 *                 format: password
 *                 description: Must match the password field
 *                 example: Password123!
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional profile image (JPG, PNG, etc.)
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   example: User created successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     phone:
 *                       type: string
 *                       example: +1234567890
 *                     address:
 *                       type: string
 *                       example: 123 Main St, New York, NY 10001
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: https://cloudinary.com/users/image123.jpg
 *                     role:
 *                       type: string
 *                       example: user
 *       400:
 *         description: Bad request - Validation errors
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
 *                   enum:
 *                     - All fields are required!
 *                     - Invalid email format!
 *                     - Password must start with Uppercase and include special char.
 *                     - Passwords do not match!
 *                     - User already exists!
 *                   example: All fields are required!
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
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */
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
