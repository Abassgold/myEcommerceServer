const express = require('express')
const { newOrder, getSingleOrder } = require('../controller/orderController')
const Router = express.Router()
Router.post('/new-order', newOrder)
Router.get('/single-order', getSingleOrder)
module.exports = Router