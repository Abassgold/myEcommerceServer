const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    product: {
        type: String,
        required: [true, 'pls enter the product name'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    price:  {
        type: Number,
        required: [true, 'pls enter the product price'],
        maxLength: [5, 'Product name cannot exceed 5 characters']
        
    }, 
    description: {
        type: String,
        required: [true, 'pls enter the product description'],
    },
    ratings: {
        type: String,
        default: 0
    },
    images: [
        {
            public_id:{
                type:String,
                required: true
            },
            url:{
                type:String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required:[true, 'Pls select category for this product'],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptop',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sport',
                'Outdoor',
                'Home'
            ],
            message: 'Pls select the correct category for product'
        }
    },
    seller:{
        type: String,
        required:[true, 'Pls enter product seller']
    },
    stock:{
        type: Number,
        required:[true, 'Pls enter product stock'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            // user:{
            //     type: mongoose.Schema.ObjectId,
            //     ref: 'user',
            //     required: true
            // },
            name:{
                type:String,
                required: true
            },
            rating:{
                type: Number,
                required:true,
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const productModel = mongoose.model('productModel', productSchema)
module.exports = productModel;