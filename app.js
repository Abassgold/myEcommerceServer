const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const {Route} = require('./route/User.Router')
require('dotenv').config()
const app = express();
let port = process.env.port;
let URI = process.env.URI
let productURI = process.env.productURI
const connection = app.listen(port, e=>{
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

const serverSocket = require('socket.io')
const io = serverSocket(connection, {
    cors:{origin:'*'}
})
io.on('connection', (socket)=>{
    console.log(`A user connected`)
    socket.on('sendMessage', (payload)=>{
        console.log(payload);
    })
    socket.on('disconnect', ()=>{
        console.log('A user disconnected')
    })
})


