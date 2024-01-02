const productModel = require('../model/Product.model')
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
        console.log(`No result found ${product}`);
        res.json({ msg: `No result found` })
        return;
    }
    try {
        const response = await productModel.findByIdAndDelete(id)
        res.status(200).json({ msg: `Product deleted successfully` })
        console.log(`product deleted successfully`);
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
    console.log(review)
    const product = await productModel.findById(productId)
    console.log(product);
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
}