const productModel = require('../model/Product.model')
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});
const admin = async (req, res) => {
    const { 
        product,
        price,
        description,
        images,
        category,
        seller,
        stock
    } = req.body;
    try {

        const results = await Promise.all(images.map(async (image) => {
            const result = await cloudinary.v2.uploader.upload(image);
            return {
                public_id: result?.public_id,
                url: result?.url
            };
        }));
        const products = new productModel({
            product,
            price: price.toFixed(0),
            description,
            images: [...results],
            category,
            seller,
            stock
        })
        const savedProduct = await products.save();
        res.status(200).json({
            success: true
        })
    } catch (error) {
        console.log(error?.message);
    }
}
const adminGetProducts = async(req, res)=>{
    console.log('admin get product')
    try {
        const totalProducts = await productModel.find().sort({createdAt: -1})
        res.status(200).json({
            result: totalProducts
        })
    } catch (error) {
        console.log(error?.message);
    }
}
const getProducts = async (req, res) => {
    const { page, filter } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;
    const totalProducts = await productModel.countDocuments();
    if (filter) {
        productModel.find()
            .then((result) => {
                let filteredResult = result;

                if (filter) {
                    filteredResult = result.filter(item => {
                        return item.product.toLowerCase().includes(filter.toLowerCase());
                    });
                }
                const totalFilteredProducts = filteredResult.length;
                const paginatedResult = filteredResult.slice(skip, skip + limit);
                setTimeout(() => {
                    res.json({
                        success: true,
                        productCount: totalFilteredProducts,
                        totalPages: Math.ceil(totalFilteredProducts / limit),
                        result: paginatedResult
                    });
                }, 1000);
            })
            .catch((err) => {
                console.log(`error while fetching products ${err}`);
            })
        return;
    }
    productModel.find()
        .skip(skip)
        .limit(limit)
        .then((result) => {
            setTimeout(() => {
                res.json({
                    succes: true,
                    productCount: totalProducts,
                    totalPages: Math.ceil(totalProducts / limit),
                    result
                })
            }, 1000);
        })
        .catch((err) => {
            console.log(`error while fetching products ${err}`);
        })
};
function getSingleProduct(req, res) {
    const { id } = req.params
    productModel.findById(id)
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    success: false,
                    msg: 'Product not found'
                })
                return;
            }
            setTimeout(() => {
                res.status(200).json({
                    succes: true,
                    result
                })
            }, 2000);
        })
        .catch((err) => {
            console.log(`Error while fetching single product ${err}`);
        })
};
const updateProduct = async (req, res) => {
    const { id } = req.params
    try {
        const response = await productModel.findByIdAndUpdate(id, req.body)
        res.json(response)
    } catch (err) {
        console.log(`Cannot update ${err}`);
        res.status(500).json({ error: 'something went wrong' })
    }
}
const deleteProduct = async function (req, res) {
    const { id } = req.params
    const product = await productModel.findById(id)
    if (!product) {
        res.json({ msg: `No result found` })
        return;
    }
    try {
        const response = await productModel.findByIdAndDelete(id)
        res.status(200).json({ msg: `Product deleted successfully` })
    } catch (err) {
        console.log(`Something went wrong ${err}`);
        res.status(500).json({ msg: `Something went wrong` })
    }
}
// Create new review

const createproductReview = async (req, res) => {
    const { rating, comment, productId, userId, userName } = req.body;
    const review = {
        user: userId,
        name: userName,
        rating: Number(rating),
        comment
    }
    const product = await productModel.findById(productId)
    const isReviewed = product.reviews.find(review => review.user.toString() === userId.toString());
    if (isReviewed) {
        product.reviews.map((review) => {
            if (review.user.toString() === userId.toString()) {
                review.comment = comment.toString();
                review.rating = rating;
            }
        })
    }
    else {
        product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, items) => {
        return items.rating + acc
    }, 0) / product.reviews.length;
    await product.save();
    res.json({
        success: true,
        reviews: product.reviews
    })
}

const deleteProductReview = async function (req, res) {
    const { reviewId } = req.body;
    const product = await productModel.findById(req.params.id);
    const reviews = product.reviews.filter(review => review._id.toString() !== reviewId.toString());
    const numOfReviews = reviews.length;
    const ratings = reviews.reduce((acc, items) => {
        return items.rating + acc
    }, 0) / product.reviews.length;
    await productModel.findByIdAndUpdate(req.params.id, {
        reviews,
        ratings,
        numOfReviews
    })
    res.status(200).json({
        succes: true,
        reviews: product.reviews
    })
}

module.exports = {
    admin,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createproductReview,
    deleteProductReview,
    adminGetProducts
}