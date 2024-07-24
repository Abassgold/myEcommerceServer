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
    }, 
    photo:{
            public_id:{
                type:String,
                required: true
            },
            url:{
                type:String,
                required: true
            }
    },
    role: {
        type:String,
        default: 'user',
    }
}, {timestamps: true})
userSchema.pre('save', function(next){
    this.email = this.email.toLowerCase();
    next();

})

const userModel = mongoose.model('userModel', userSchema)
module.exports = userModel