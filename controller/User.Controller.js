const { userModel, productModel, } = require('../model/User.Model')
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
                res.status(400)
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
                                return res.json({ token })
                            }
                            console.log(`No Token generated`)
                        })
                        console.log(`is match ${process.env.Secret}`)
                    }
                    else {
                        console.log(`Does not match`)
                        return res.json(400).json({ mssg: 'Incorrect password' })
                    }
                }
            })
        })
}
const admin = (req, res) => {
    const product = new productModel(req.body)
    console.log(product);
    product.save()
        .then((result) => {
            console.log('product saved');
            res.json(result)
        })
        .catch(err => {
            console.log('product cannot save' + err);
        })
}
const getProducts = (req, res) => {
    productModel.find()
        .then((result) => {
            console.log(result);
            res.json({
                succes: true,
                count: result.length,
                result
            })
        })
        .catch((err) => {
            console.log(`error while fetching products ${err}`);
        })
};

function getSingleProduct(req, res) {
    const { id } = req.params
    productModel.findById(id)
        .then((result) => {
            console.log(result);
            if (!result) {
                res.status(404).json({
                    success: false,
                    msg: 'Product not found'
                })
                return;
            }
            res.status(200).json({
                succes: true,
                result
            })
        })
        .catch((err)=>{
            console.log(`Error while fetching single product ${err}`);
        })
};
const updateProduct =(req, res)=>{

}
module.exports = {
    SignUp,
    SignIn,
    admin,
    getProducts,
    getSingleProduct,
    updateProduct
}