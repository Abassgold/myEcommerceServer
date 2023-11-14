const {SignUp, SignIn, admin, getProducts, getSingleProduct} = require('../controller/User.Controller')
const express = require('express')
const Route = express.Router()

Route.post('/signup', SignUp);
Route.post('/signin', SignIn)
Route.post('/product', admin)
Route.get('/all-products', getProducts)
Route.get('/product/:id', getSingleProduct)
Route.patch('/')
module.exports = {Route}
