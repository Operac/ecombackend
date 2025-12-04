const express = require("express")
const uploads = require("../middlewares/uploads")
const { registerUser, loginUser } = require("../controllers/userController")
const userRouter = express.Router()

userRouter.post("/registeruser", uploads.single("image"), registerUser)
userRouter.post("/loginuser",  loginUser)


module.exports = userRouter
