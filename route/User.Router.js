const {SignUp, SignIn} = require('../controller/User.Controller')
const express = require('express')
const Route = express.Router()

Route.post('/signup', SignUp);
Route.post('/signin', SignIn)
module.exports = {Route}
