const express = require('express')
const Route = express.Router()

const {
    SignUp,
    SignIn,
    admin,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getDashboard,
} = require('../controller/User.Controller')

Route.post('/signup', SignUp);
Route.post('/signin', SignIn)
Route.get('/dashboard', getDashboard)
Route.post('/product', admin)
Route.get('/all-products', getProducts)
Route.get('/product/:id', getSingleProduct)
Route.patch('/update-product/:id', updateProduct)
Route.delete('/delete-product/:id', deleteProduct)
module.exports = { Route }
