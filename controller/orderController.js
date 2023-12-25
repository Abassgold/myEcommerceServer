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
// Gettin single order
const getSingleOrder = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const orders = await order.findById(id);
        console.log(orders);
        if (!(orders)) {
            res.json({
                success: false,
                msg: 'No order found with this ID'
            })
            return;
        }
        res.status(200).json({
            success: true,
            msg: orders
        })
    } catch (error) {
        res.json({
            error: error.message
        })
    }
}

/// get login user order
const myOrders = async (req, res) => {
    const { id } = req.body;
    try {
        const response = await order.find({ user: id })
        if (!response) {
            res.json({
                success: false,
                msg: "No odeered items"
            })
            return;
        }
        res.json({
            success: true,
            msg: response
        })
    } catch (err) {
        res.json({ success: false, msg: err.message })
    }
}
// get all orders from ADMIN
const getallOrders = async (req, res) => {
    try {
        const result = await order.find()
        let totalAmount = 0;
        result.map((amount) => {
            totalAmount += amount.totalPrice;
        })
        res.json({
            success: true,
            totalAmount,
            result,
        })
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        })
    }
}
// update and process orders using their id by admin
const allOrders = async (req, res) => {
    try {
        const result = await order.findById(req.params.id)
        if(result.orderStatus === 'Delivered'){
            res.json({
                success: false,
                msg: 'You have already delivered this order'
            })
            return;
        } 
        // result.orderItems.map(async (items) =>{
        //     await
        // })
        result.orderStatus = req.body.status;
        result.deliveredAt = Date.now()
        await result.save();
        res.json({
            success: true,
            msg: result
        })
    } catch (error) {
        console.log(error.message)
    }
}
async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.s
}
// Delete order by Admin using oder ID
const deleteOrder = async (req, res) =>{
    try {
        const result = await order.findById(req.params.id)
    if(!result){
        res.json({
            success: false,
            msg: 'There is no Order with such ID'
        })
        return;
    }
    await order.findByIdAndDelete(req.params.id)
    res.json({
        success: true, 
        msg: 'Order has been removed'
    })
    } catch (error) {
       res.json({
        success: false,
        msg: error.message
       }) 
    }
}
module.exports = {
    newOrder,
    getSingleOrder,
    myOrders,
    getallOrders,
    allOrders,
    deleteOrder
}