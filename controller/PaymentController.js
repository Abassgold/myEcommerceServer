const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
  };

const processPayment = async(req, res)=>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
        metadata:{ integration_check: 'accept_a_payment'}
      });
    
      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
      });
    
}
const sendStripeApi = (req, res) => {
  res.status(200).json({
    success: true,
    stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
}
module.exports = { processPayment, sendStripeApi}