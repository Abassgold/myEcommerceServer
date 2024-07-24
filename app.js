const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const userRoute = require('./route/User.Router');
const productRoute = require('./route/Product.Router');
const orderRoutes = require('./route/Order.Router');
const cookieParser = require('cookie-parser');
const userModel = require('./model/User.Model');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const router = require('./route/Payment.Router');


require('dotenv').config()
const app = express();
let port = process.env.port;
let URI = process.env.URI
let productURI = process.env.productURI
mongoose.connect(URI).then(e => {
    console.log(`Database connected`);
    app.listen(port)
}).catch(e => {
    console.log(`Error occured while connecting to the database, ${e}`);
})
app.use(cors())
app.use(cookieParser())
// register view engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use('/user', userRoute)
app.use('/admin', productRoute)
app.use('/orders', orderRoutes)
app.use('/payment', router)
app.get('/reset-password/:id/:token', async (req, res) => {
console.log(req.params);
let { id, token } = req.params;
    console.log(req.params);
    try {
        const response = await userModel.findById(id)
        if (!response) {
            res.json({ msg: 'No such user' })
            return;
        }
        let newScreteLink = process.env.Secret + response.email + response.password + response._id
        const decoded = await jwt.verify(token, newScreteLink);
        console.log(decoded)
        // let update = await userModel.findByIdAndUpdate(id, { password: updatedPassword })
        res.render('resetpassword', {token, id})
    } catch (error) {
        console.log(` the err is ${error.message}`);
        res.render('expired')
        return;
    }

});
app.post('/reset-password/:id/:token', async function (req, res) {
    try {
    const { password, confirmPassword } = req.body;
    const {id, token} = req.params;

        if (!(password && confirmPassword)) {
            console.log('Fill in all emptyspaces ');
            res.render('resetpassword', {msg: 'Please fill in all empty spaces'});
            return;
        }
        const trimmedBody = {};
        for (const key in req.body) {
            trimmedBody[key] = req.body[key].trim();
        }
        console.log(trimmedBody);
        console.log(req.params);
        if (trimmedBody.password === '') {
            res.render('resetpassword', {msg : 'Space cannot be empty'})
            return console.log('Space cannot be empty');
        }
        if (trimmedBody.confirmPassword === '') {
            res.render('resetpassword', {msg : 'Space cannot be empty'})
            return console.log('Space cannot be empty');
        }
        if (!(trimmedBody.password === trimmedBody.confirmPassword)) {
            res.render('resetpassword', {msg : 'Password does not match'})
            return console.log('Password does not match')
        }
        const  response = await userModel.findById(id);
        if(response){
            const newSecretLink = process.env.Secret + response.email + response.password + response._id;
            const decoded = await jwt.verify(token, newSecretLink);
            console.log(decoded);
        
            // Update the user's password
            const hashedPassword = await bcrypt.hash(confirmPassword, 10);
            await userModel.findByIdAndUpdate(decoded.id, { password: hashedPassword });
        
            // Optionally, retrieve the updated user
            const updatedUser = await userModel.findById(decoded.id);
            console.log(updatedUser);
        }
        
        
    } catch (err) {
        console.log(` the err is ${err.message}`);
        res.render('expired')
    }
})

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


