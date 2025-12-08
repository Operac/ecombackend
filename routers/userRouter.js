const express = require("express")
const uploads = require("../middlewares/uploads")
const { registerUser, loginUser } = require("../controllers/userController")
const userRouter = express.Router()

userRouter.post("/registeruser", uploads.single("image"), registerUser)
/**
 * @swagger
 * /loginuser:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login Successfully
 */
userRouter.post("/loginuser",  loginUser)


module.exports = userRouter
