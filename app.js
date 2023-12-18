const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const {Route} = require('./route/User.Router');
const orderRoutes = require('./route/Order.Router');
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express();
let port = process.env.port;
let URI = process.env.URI
let productURI = process.env.productURI
 mongoose.connect(URI).then(e=>{
    console.log(`Database connected`);
    app.listen(port)
}).catch(e=>{
    console.log(`Error occured while connecting to the database, ${e}`);
})
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended: true, limit:'10mb'}));
app.use(express.json({limit:'10mb'}));
app.use('/user', Route)
app.use('/admin', Route)
app.use('/order', orderRoutes)

// const serverSocket = require('socket.io')
// const io = serverSocket(connection, {
//     cors:{origin:'*'}
// })
// io.on('connection', (socket)=>{
//     console.log(`A user connected`)
//     socket.on('sendMessage', (payload)=>{
//         console.log(payload);
//     })
//     socket.on('disconnect', ()=>{
//         console.log('A user disconnected')
//     })
// })


