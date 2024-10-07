const mongoose = require('mongoose')

const oderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phoneNo: { type: String, required: true },
    country: { type: String, required: true },
    reference: { type: String, required: true },
    trans: { type: String, required: true },
    status: { type: String, required: true },
    message: { type: String, required: true },
    transaction: { type: String, required: true },
    trxref: { type: String, required: true },
    redirecturl: { type: String },

    // Cart Items
    cartItems: [{
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        product: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        //   ratings: { type: String },
        //   images: [{ type: String }], // Assuming images is an array of URLs
        category: { type: String },
        seller: { type: String },
        //   numOfReviews: { type: Number },
        //   reviews: [{ type: String }], // Assuming reviews is an array of strings
        quantity: { type: Number, required: true },
        qtyPrice: { type: Number, required: true }
    }],

    taxPrice: { type: Number, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    orderStatus: { type: String, required: true, enums: ['processing', 'delivered'], default: 'processing' },
    // orderStatus
    // "Processing"

    // Date and Time
    date: { type: String, required: true },
    time: { type: String, required: true },

    // User Information
    user: {
        photo: {
            public_id: { type: String },
            url: { type: String }
        },
        email: { type: String, required: true},
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    userId:{ type: mongoose.Schema.Types.ObjectId, required: true }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});



module.exports = mongoose.model('Order', oderSchema) 