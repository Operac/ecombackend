const express = require("express")
const { initializePayment, verifyPayment, getUserReceipts } = require("../controllers/paymentController")
const { isUser } = require("../middlewares/auth")
const paymentRouter = express.Router()

/**
 * @swagger
 * /payment/initializepayment:
 *   post:
 *     summary: Initialize payment for user's cart
 *     description: Creates a Flutterwave payment link for the items in the user's cart
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: Email of the user making the payment
 *     responses:
 *       201:
 *         description: Payment initialized successfully
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
 *                   example: Payment initialized successfully!
 *                 link:
 *                   type: string
 *                   example: https://checkout.flutterwave.com/v3/hosted/pay/xxxxx
 *                   description: Flutterwave payment link
 *                 order_id:
 *                   type: string
 *                   format: uuid
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                   description: Unique order identifier
 *       400:
 *         description: Bad request - User or cart does not exist
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
 *                   example: User does not exist!
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
 *                   example: Something went wrong!
 */
paymentRouter.post("/initializepayment", isUser, initializePayment)

/**
 * @swagger
 * /payment/verifypayment:
 *   post:
 *     summary: Verify payment transaction
 *     description: Verifies Flutterwave payment and creates receipt with order details
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flutterwave transaction ID returned from payment
 *         example: "1234567"
 *     responses:
 *       200:
 *         description: Payment verified successfully
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
 *                   example: Payment successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     orderId:
 *                       type: string
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     phone:
 *                       type: string
 *                       example: "+2348012345678"
 *                     amount:
 *                       type: number
 *                       example: 50000
 *                     transactionId:
 *                       type: string
 *                       example: "1234567"
 *                     status:
 *                       type: string
 *                       example: successful
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     receiptItem:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           receiptId:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: Product Name
 *                           price:
 *                             type: number
 *                             example: 25000
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           total:
 *                             type: number
 *                             example: 50000
 *                           ProductId:
 *                             type: integer
 *                             example: 5
 *                           image:
 *                             type: string
 *                             nullable: true
 *                             example: https://example.com/image.jpg
 *       400:
 *         description: Bad request - Missing transaction_id, user/cart not found, or receipt already exists
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
 *                   example: Missing transaction_id
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error message
 */
paymentRouter.post("/verifypayment", isUser, verifyPayment)

/**
 * @swagger
 * /payment/receipts/{userId}:
 *   get:
 *     summary: Get all receipts for a user
 *     description: Retrieves all payment receipts for a specific user, ordered by creation date (newest first)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *         example: 1
 *     responses:
 *       200:
 *         description: Receipts retrieved successfully
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
 *                   example: Receipts retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       orderId:
 *                         type: string
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         example: user@example.com
 *                       phone:
 *                         type: string
 *                         example: "+2348012345678"
 *                       amount:
 *                         type: number
 *                         example: 50000
 *                       transactionId:
 *                         type: string
 *                         example: "1234567"
 *                       status:
 *                         type: string
 *                         example: successful
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       receiptItem:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             receiptId:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: Product Name
 *                             price:
 *                               type: number
 *                               example: 25000
 *                             quantity:
 *                               type: integer
 *                               example: 2
 *                             total:
 *                               type: number
 *                               example: 50000
 *                             ProductId:
 *                               type: integer
 *                               example: 5
 *                             image:
 *                               type: string
 *                               nullable: true
 *                               example: https://example.com/image.jpg
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
 *                   example: Failed to retrieve receipts
 */
paymentRouter.get("/receipts/:userId", isUser, getUserReceipts)
module.exports = paymentRouter