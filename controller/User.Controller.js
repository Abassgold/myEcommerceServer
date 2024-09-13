const userModel = require('../model/User.Model')
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
const SignUp = async (req, res) => {
    let { firstName, lastName, email, password, photo } = req.body
    const found = await userModel.findOne({ email: req.body.email.toLowerCase() })
    console.log(`the result is ${found}`);
    if (found) {
        console.log(`Email already been register with another account`);
        return res.status(200).json({ msg: `Email already registered with another account`, success: false })
    }
    bcrypt.hash(password, 10, (err, hashed) => {
        if (err) return console.log(`password cannot hash ${err}`)
        cloudinary.v2.uploader.upload(photo, (err, result) => {
            if (err) return console.log(`File could not be uploaded`);
            console.log(result);
            let myFile = result.secure_url
            const model = new userModel({
                firstName,
                lastName,
                email: email.toLowerCase(),
                password: hashed,
                photo: {
                    public_id: result.public_id,
                    url: myFile
                }
            })

            model.save()
                .then(e => {
                    console.log(`saved to database, ${hashed}`)
                    res.status(200).json({ success: true })
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
    userModel.findOne({ email: email.toLowerCase() })
        .then((user) => {
            if (!user) {
                setTimeout(() => {
                    res.status(200).json({ msg: "There's no account registered under this email", success: false })
                }, 500);
                return;
            }
            let userpassword = user.password
            bcrypt.compare(password, userpassword, (err, isMatch) => {
                if (err) return console.log(`Error while comapring password ${err}`)
                else {
                    if (isMatch) {
                        jwt.sign({ email: email.toLowerCase() }, process.env.Secret, { expiresIn: '24h' }, (err, token) => {
                            if (err) return console.log(err)
                            if (token) {
                                const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                                res.cookie("token", token, {
                                    expires: expiryDate,
                                    httpOnly: true
                                })
                                setTimeout(() => {
                                    return res.status(200)
                                    .json({ msg: 'Login successful', token, success: true, user });
                                }, 200);
                            }
                        })
                    }
                    else {
                        setTimeout(() => {
                            console.log(`Incorrect password`)
                            res.json({ msg: 'Incorrect password', success: false })
                        }, 200);
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
            res.json({ msg: `Log in first ${err.message}`, success: false })
            return;
        }
        console.log(decoded.email);
        userModel.findOne({ email: decoded.email })
            .then((user) => {
                res.json({ user, success: true });
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
    console.log(email)
    try {
        const response = await userModel.findOne({ email: email.toLowerCase() })
        if (!response) {
            res.status(200).json({
                msg: 'Email is not registered',
                success: false
            })
            return;
        }
        const payload = {
            password: response.password,
            id: response._id
        }
        let newScreteLink = process.env.Secret + response.email + response.password + response._id;
        const token = await jwt.sign(payload, newScreteLink, { expiresIn: '20m' })
        const dotlessToken = token.replace(/\./g, '*')
        console.log(dotlessToken);
        const link = `http://localhost:5173/reset-password/${response._id}/${dotlessToken}`
        res.status(200).json({
            success: true,
            link
        })
    } catch (error) {
        console.log(error.message);
    }
}
async function getRestPassword(req, res) {
    try {
        let { id, token } = req.params;
        const dotToken = token.replace(/\*/g, '.')
        const response = await userModel.findById(id)
        if (!response) {
            return res.status(200).json({ msg: 'No such user', success: false })
        }
        let newScreteLink = process.env.Secret + response.email + response.password + response._id
        console.log(newScreteLink);
        const decoded = await jwt.verify(dotToken, newScreteLink);
        console.log(decoded);
        if (decoded) {
            res.status(200).json({
                success: true,
            })
            return;
        }
    } catch (error) {
        console.log(`The mess ofjj ${error.message}`);
        return res.status(200).json({
            msg: 'The link is expired. Please try again',
            error: error.message,
            success: false
        })
    }
}
async function resetPassword(req, res) {
    try {
        const { password, confirmPassword } = req.body;
        const { id, token } = req.params;

        if (!(password && confirmPassword)) {
            console.log('Fill in all emptyspaces ');
            res.status(200).json({ success: false, msg: `Fill in empty spaces` });
            return;
        }
        const trimmedBody = {};
        for (const key in req.body) {
            trimmedBody[key] = req.body[key].trim();
        }
        console.log(trimmedBody);
        console.log(req.params);
        if (trimmedBody.password === '') {
            res.status(200).json({ msg: 'Space cannot be empty', success: false })
            return console.log('Space cannot be empty');
        }
        if (trimmedBody.confirmPassword === '') {
            res.status(200).json({ msg: 'Space cannot be empty', success: false })
            return console.log('Space cannot be empty');
        }
        if (!(trimmedBody.password === trimmedBody.confirmPassword)) {
            res.status(200).json({ msg: 'Password does not match', success: false })
            return console.log('Password does not match')
        }
        const response = await userModel.findById(id);
        if (response) {
            const newSecretLink = process.env.Secret + response.email + response.password + response._id;
            const decoded = await jwt.verify(token, newSecretLink);
            console.log(decoded);

            // Update the user's password
            const hashedPassword = await bcrypt.hash(confirmPassword, 10);

            const updatePassword = await userModel.findByIdAndUpdate(decoded.id, { password: hashedPassword });

            console.log(updatePassword);
        }
        else {
            return res.status(200).json({ msg: 'User not found', success: false });
        }

    } catch (err) {
        console.log(` the err is ${err.message}`);
        res.status(200).json({ msg: err.message, success: false });
    }
}
const updatePassword = async (req, res) => {
    const { id, oldPassword, newPassword } = req.body
    console.log(req.body);
    try {
        const response = await userModel.findById(id)
        const isMatch = await bcrypt.compare(oldPassword, response.password)
        if (!(isMatch)) {
            return res.status(200).json({ msg: 'Old password is incorrect', success: false });
        }
        const hashed = await bcrypt.hash(newPassword, 10)
        const update = await userModel.findByIdAndUpdate(id, { password: hashed })
        res.status(200).json({ msg: 'password updates successfully', success: true })
    } catch (err) {
        res.json({ status: false, msg: err.message })
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
const editprofile = async (req, res) => {
    const { id, firstName, email, lastName, photo } = req.body;
    try {
        const picId = await userModel.findById(id);
        if (!picId) {
            return res.status(200).json({ success: false, msg: 'user not found' })
        }
        const newUser = {
            firstName,
            lastName,
            email: email.toLowerCase()
        }
        const newPicid = await cloudinary.v2.uploader.upload(photo);
        newUser.photo = {
            public_id: newPicid.public_id,
            url: newPicid.secure_url
        }
        const editedProfileResult = await userModel.findByIdAndUpdate(id, newUser)
        const token = await jwt.sign({ email: email.toLowerCase() }, process.env.Secret, { expiresIn: '24h' });
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.log(`the error is ${error.message}`);
        if (error) {
            return res.status(200).json({ success: true })
        }
    }
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
    updatePassword,
    editprofile,
    resetPassword,
}