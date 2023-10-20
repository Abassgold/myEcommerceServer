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
    let {email, password} = req.body
    userModel.findOne({email})
    .then((user)=>{
        let userpassword = user.password
        bcrypt.compare(password, userpassword, (err, isMatch)=>{
            if(err) return console.log(`There is an error while comapring password ${err}`)
            else{
                if(isMatch){
                    jwt.sign({email}, process.env.Secret, {expiresIn : '24h'},(err,token )=>{
                        if(err) return console.log(err)
                        if (token) {
                            console.log(`The token is ${token}`)
                            return res.json({token})
                        }
                        console.log(`No Token generated`)
                    } )
                    console.log(`is match ${process.env.Secret}`)
                }
                else{
                    console.log(`Does not match`)
                }
            }
        })
    })
}
module.exports = { SignUp, SignIn }