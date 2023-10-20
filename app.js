const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const {Route} = require('./route/User.Router')
require('dotenv').config()
const app = express();
let port = process.env.port;
let URI = process.env.URI
let productURI = process.env.productURI
app.listen(port, e=>{
    console.log(`server connected at ${port}`)
 })
 mongoose.connect(URI ).then(e=>{
    console.log(`Database connected`);
}).catch(e=>{
    console.log(`Error occured while connecting to the database, ${e}`);
})
app.use(cors())
app.use(express.urlencoded({extended: true, limit:'10mb'}));
app.use(express.json({limit:'10mb'}));
app.use('/user', Route)

