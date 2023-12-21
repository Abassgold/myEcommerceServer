const express = require('express')
const {
    newOrder,
    getSingleOrder,
    myOrders,
    getallOrders
} = require('../controller/orderController')
const Router = express.Router()
Router.post('/new-order', newOrder)
Router.get('/single-order/:id', getSingleOrder)
Router.post('/myOrder/me', myOrders)
Router.get('/orders', getallOrders)
module.exports = Router