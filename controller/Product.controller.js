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

module.exports = {
    admin,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
}