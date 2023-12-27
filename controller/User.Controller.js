const  userModel = require('../model/User.Model')
const nodeMailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')
require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});
const SignUp = (req, res) => {
    let { firstName, lastName, email, password, photo } = req.body

    bcrypt.hash(password, 10, (err, hashed) => {
        if (err) return console.log(`password cannot hash ${err}`)
        cloudinary.v2.uploader.upload(photo, (err, result) => {
            if (err) return console.log(`File could not be uploaded`);
            let myFile = result.secure_url
            const model = new userModel({ firstName, lastName, email, password: hashed, photo: myFile })
            model.save()
                .then(e => {
                    console.log(`saved to database, ${hashed}`)
                    res.status(200).json({ mssg: "Welcome", message: "Uploaded successfully" })
                })
                .catch((err) => {
                    console.log('cannot save to database' + err);
                    res.status(400)
                })
        })
    })
}
const SignIn = (req, res) => {
    let { email, password } = req.body
    userModel.findOne({ email })
        .then((user) => {
            if (!user) {
                console.log(`User not found`)
                res.status(400).json({ msg: 'user not found' })
                return;
            }
            let userpassword = user.password
            bcrypt.compare(password, userpassword, (err, isMatch) => {
                if (err) return console.log(`Error while comapring password ${err}`)
                else {
                    if (isMatch) {
                        jwt.sign({ email }, process.env.Secret, { expiresIn: '24h' }, (err, token) => {
                            if (err) return console.log(err)
                            if (token) {
                                console.log(`The token is ${token}`)
                                return res.status(200).json({ msg: 'Login successful', token });
                            }
                            console.log(`No Token generated`)
                        })
                    }
                    else {
                        console.log(`Incorrect password`)
                        res.json({ msg: 'Incorrect password' })
                        return;
                    }
                }
            })
        })
}

const getDashboard = (req, res) => {
    const { authorization } = req.headers;
    let token = authorization.split(' ')[1];
    jwt.verify(token, process.env.Secret, (err, decoded) => {
        if (err) {
            res.json({ msg: `Log in first ${err.message}` })
            return;
        }
        console.log(decoded);
        userModel.findOne({ email: decoded.email })
            .then((user) => {
                res.json(user);
            })
            .catch((err) => {
                console.log(`error while finding user ${err.message}`);
            })
    })
}
const logOut = (req, res) => {
    console.log(req.cookie.token);
    res.clearCookie('token',
        {
            httpOnly: true
        })
    res.status(200)
        .json({
            succes: true,
            msg: 'Logout successful',
            cook: req.cookies
        })
    console.log(req.cookies.token);
}

const forgotPassword = async function (req, res) {
    let { email } = req.body
    // create one time link that is valid for 5mins
    try {
        const response = await userModel.findOne({ email })
        console.log(response);
        if (!response) {
            res.status(400).json({
                msg: 'User not registered'
            })
            return;
        }
        const payload = {
            password: response.password,
            id: response._id
        }
        let newScreteLink = process.env.Secret + response.email + response.password + response._id
        const token = await jwt.sign(payload, newScreteLink, { expiresIn: '5m' })
        const link = `http://localhost:5000/user/reset-password/${response._id}/${token}`
        res.json({
            msg: 'Password reset link sent to your email',
            token,
            link
        })
        console.log(link);
    } catch (error) {
        console.log(error.message);
    }
}
async function getRestPassword(req, res) {
    let { id, token } = req.params;
    console.log(req.body.password);
    try {
        const response = await userModel.findById(id)
        if (!response) {
            res.json({ msg: 'No such user' })
            return;
        }
        let newScreteLink = process.env.Secret + response.email + response.password + response._id
        const decoded = await jwt.verify(token, newScreteLink);
        let updatedPassword = await bcrypt.hash(req.body.password, 10)
        let update = await userModel.findByIdAndUpdate(id, { password: updatedPassword })
        res.status(200).json({
            msg: 'password reset succesfully',
            decoded,
            update
        })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            msg: 'The link is expired. Please try again',
            error: error.message
        })
        return;
    }
}
const updatePassword = async (req, res) => {
    const { id, oldPassword, newPassword } = req.body
    try {
        const response = await userModel.findById(id)
        const isMatch = await bcrypt.compare(oldPassword, response.password)
        if (!(isMatch)) {
            res.json({ msg: 'Old password is incorrect', isMatch })
            return;
        }
        const hashed = await bcrypt.hash(newPassword, 10)
        const update = await userModel.findByIdAndUpdate(id, { password: hashed })
        res.json({ update })
    } catch (err) {
        res.joson({ status: 400, msg: err.message })
    }
}
const getAllUsers = async (req, res) => {
    const users = await userModel.find()
    if (!(users.length > 0)) {
        res.json({ msg: 'No users found' })
        return;
    }
    res.status(200).json({
        success: true,
        users
    })
}
const getSingleUser = (req, res) => {
    const { id } = req.params;
    console.log(id);
    userModel.findById(id)
        .then((user) => {
            console.log(user);
            if (!user) {
                res.status(404).json({
                    msg: 'User not found'
                })
                return;
            }
            res.status(200).json({
                success: true,
                user
            })
        })
        .catch((err) => {
            res.json({ msg: err.message })
        })
}
module.exports = {
    getSingleUser,
    getAllUsers,
    SignUp,
    SignIn,
    logOut,
    getDashboard,
    getRestPassword,
    forgotPassword,
    updatePassword
}