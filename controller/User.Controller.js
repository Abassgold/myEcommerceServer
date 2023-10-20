const { userModel } = require('../model/User.Model')
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
            const model = new userModel({ firstName, lastName, email, password: hashed, photo: myFile})
            model.save()
                .then(e => {
                    console.log(`saved to database, ${hashed}`)
                    res.status(200).json({ mssg: "Welcome", message: "Uploaded successfully"})
                })
                .catch((err) => {
                    console.log('cannot save to database' + err);
                    res.status(400).send({ mss: 'youre not welcome' })
                })
        })
    })
}
const SignIn = (req, res) => {
    userModel.findOne({ email: req.body.email })
        .then((result) => {
            if (!result) {
                console.log(`No user found`);
                return res.status(400).json({ user: `User not found` })
            }
            console.log(`the result is ${result}`)
            bcrypt.compare(req.body.email, result.password, (err, isMatch) => {
                if (err) {
                    return console.log(`Error whule comparing password ${err}`)
                }
                if (!isMatch) {
                    return console.log(`Password does not match ${isMatch}, ${req.body.password}`)
                }
                console.log(isMatch);
            })
        })
        .catch(err => {
            cosnole.log(`Error while searching ${err}`)
        })
    console.log(req.body)
}
module.exports = { SignUp, SignIn }