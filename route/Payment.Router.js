const express = require('express');
const {
    processPayment,
    sendStripeApi
} = require('../controller/PaymentController');
const router = express.Router();
router.post('/process', processPayment)
router.get('/stripeapi', sendStripeApi)

module.exports = router;