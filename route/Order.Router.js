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
Router.post('/new-order', newOrder)
Router.get('/single-order/:id', getSingleOrder)
Router.post('/myOrder/me', myOrders)
Router.get('/orders', getallOrders)
Router.put('/orders/:id', allOrders)
Router.delete('/orders/:id', deleteOrder)
module.exports = Router;