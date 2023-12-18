const order = require('../model/order.model')

// create a new order
const newOrder = async (req, res) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        user
    } = req.body;
    const orderModel = new order({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user
    })
    try {
        const response = await orderModel.save()
        res.json({
            success: true,
            response
        })
    } catch (error) {
        console.log(error.message)
    }
}
 const getSingleOrder = (req, res) => {
    console.log(req);
 }
module.exports = {newOrder,getSingleOrder}