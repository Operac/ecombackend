const express = require("express");
const {
  addToCart,
  getCart,
  updateCart,
  deleteCart,
  clearCart
} = require(`../controllers/cartController`)
const { isUser } = require('../middlewares/auth')
const cartRouter = express.Router()

/**
 * @swagger
 * /addcart:
 *   post:
 *     summary: Add item to cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - ProductId
 *             properties:
 *               userId:
 *                 type: number
 *                 example: 1
 *               ProductId:
 *                 type: number
 *                 example: 5
 *               color:
 *                 type: string
 *                 example: red
 *               size:
 *                 type: string
 *                 example: L
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart
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
 *                   example: Item added to cart
 *                 data:
 *                   type: object
 *                   properties:
 *                     ProductId:
 *                       type: number
 *                     CartId:
 *                       type: number
 *                     selectedcolor:
 *                       type: string
 *                     selectedsize:
 *                       type: string
 *                     quantity:
 *                       type: number
 *       200:
 *         description: Item quantity updated in cart
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
 *                   example: Item quantity updated in cart
 *                 data:
 *                   type: object
 *       400:
 *         description: Product not found
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
 *                   example: Product not found
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
cartRouter.post('/addcart', isUser, addToCart)

/**
 * @swagger
 * /getcart/{userId}:
 *   get:
 *     summary: Get user cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: User ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
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
 *                   example: Cart retrieved
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     userId:
 *                       type: number
 *                     ProductCart:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           ProductId:
 *                             type: number
 *                           CartId:
 *                             type: number
 *                           selectedcolor:
 *                             type: string
 *                           selectedsize:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           Product:
 *                             type: object
 *                             description: Complete product details
 *       400:
 *         description: Cart not found
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
 *                   example: Cart not found
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
cartRouter.get(`/getcart/:userId`, isUser, getCart)

/**
 * @swagger
 * /updatecart:
 *   patch:
 *     summary: Update cart item (quantity, size, or color)
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - ProductId
 *             properties:
 *               userId:
 *                 type: number
 *                 example: 1
 *               ProductId:
 *                 type: number
 *                 example: 5
 *               quantity:
 *                 type: number
 *                 description: Set to 0 or negative to remove item
 *                 example: 3
 *               selectedsize:
 *                 type: string
 *                 example: XL
 *               selectedcolor:
 *                 type: string
 *                 example: blue
 *     responses:
 *       200:
 *         description: Item updated or removed successfully
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
 *                   enum:
 *                     - Item updated successfully
 *                     - Item removed from cart
 *                   example: Item updated successfully
 *                 data:
 *                   type: object
 *                   description: Updated cart item (only if not removed)
 *       400:
 *         description: Cart or item not found
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
 *                     - Cart not found
 *                     - Item not found in cart
 *                   example: Cart not found
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
cartRouter.patch(`/updatecart`, isUser, updateCart)

/**
 * @swagger
 * /deletecart/{userid}:
 *   delete:
 *     summary: Delete a specific item from cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: number
 *         description: User ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ProductId
 *             properties:
 *               ProductId:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Item deleted successfully
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
 *                   example: Item deleted
 *                 data:
 *                   type: object
 *                   description: Deleted cart item
 *       400:
 *         description: Cart or item not found
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
 *                     - Cart not found
 *                     - Item not in cart
 *                   example: Cart not found
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
cartRouter.delete(`/deletecart/:userid`, isUser, deleteCart)

/**
 * @swagger
 * /clearcart/{userId}:
 *   delete:
 *     summary: Clear all items from user cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: User ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Cart cleared successfully
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
 *                   example: Cart cleared successfully
 *       400:
 *         description: Cart not found
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
 *                   example: Cart not found
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
cartRouter.delete(`/clearcart/:userId`, isUser, clearCart)

module.exports = cartRouter