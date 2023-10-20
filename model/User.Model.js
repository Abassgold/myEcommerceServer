const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        // unique: true,
      },
    password: {
        type: String, 
    }, 
    photo: String
})

const userModel = mongoose.model('userModel', userSchema)

module.exports = {userModel}