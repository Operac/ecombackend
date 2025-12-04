const express = require("express")
const { initializePayment, verifyPayment, getUserReceipts } = require("../controllers/paymentController")
const { isUser } = require("../middlewares/auth")
const paymentRouter = express.Router()

paymentRouter.post("/intializepayment", isUser, initializePayment)
paymentRouter.post("/verifypayment", isUser, verifyPayment)
paymentRouter.get("/receipts/:userId", isUser, getUserReceipts)
module.exports = paymentRouter