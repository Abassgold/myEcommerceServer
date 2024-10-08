const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        selected: false
    },
    photo: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
            required: true,
            default: 'https://t4.ftcdn.net/jpg/01/97/15/87/360_F_197158744_1NBB1dEAHV2j9xETSUClYqZo7SEadToU.jpg'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
}, { timestamps: true })
userSchema.pre('save', function (next) {
    this.email = this.email.toLowerCase();
    next();

})

const userModel = mongoose.model('userModel', userSchema)
module.exports = userModel