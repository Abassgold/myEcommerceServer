const express = require('express')
const {
    newOrder,
    getSingleOrder,
    myOrders,
    getallOrders,
    allOrders,
    deleteOrder
} = require('../controller/orderController')
const Router = express.Router()
Router.patch('/new-order', newOrder)
Router.get('/single-order/:id', getSingleOrder)
Router.get('/order/me/:id', myOrders)
Router.get('/all-orders', getallOrders)
Router.put('/orders/:id', allOrders)
Router.delete('/orders/:id', deleteOrder)
module.exports = Router;