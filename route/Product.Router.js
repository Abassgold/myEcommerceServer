const express = require('express')
const Route = express.Router()
const {
    admin,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createproductReview,
    deleteProductReview,
} = require('../controller/Product.controller')

Route.post('/product', admin)
Route.get('/all-products', getProducts)
Route.get('/product/:id', getSingleProduct)
Route.patch('/update-product/:id', updateProduct)
Route.delete('/delete-product/:id', deleteProduct)
Route.patch('/reviews', createproductReview)
Route.delete('/reviews/:id', deleteProductReview)

module.exports = Route;