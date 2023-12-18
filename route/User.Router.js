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
    logOut,
    getRestPassword,
    forgotPassword,
    updatePassword,
    getAllUsers,
    getSingleUser
} = require('../controller/User.Controller')

Route.post('/signup', SignUp);
Route.post('/signin', SignIn)
Route.get('/dashboard', getDashboard)
Route.post('/product', admin)
Route.get('/all-products', getProducts)
Route.get('/product/:id', getSingleProduct)
Route.get('/logout', logOut)
Route.patch('/update-product/:id', updateProduct)
Route.delete('/delete-product/:id', deleteProduct)
Route.post('/forgot-password', forgotPassword)
Route.post('/reset-password/:id/:token', getRestPassword)
Route.patch('/password/update', updatePassword)
Route.get('/users', getAllUsers)
Route.get('/users/:id', getSingleUser)
module.exports = { Route }
