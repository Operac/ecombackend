const express = require("express");
const {
  addToCart,
  getCart,
  updateCart,
  deleteCart
} = require(`../controllers/cartController`)
const { isUser } = require('../middlewares/auth')
const cartRouter = express.Router()

cartRouter.post('/addcart', isUser, addToCart)
cartRouter.get(`/getcart/:userId`, isUser, getCart)
cartRouter.patch(`/updatecart`, isUser, updateCart)
cartRouter.delete(`/deletecart/:userid`, isUser, deleteCart)

module.exports = cartRouter