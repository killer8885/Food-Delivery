const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const env = require('../config/env');

const createRazorpayOrder = (amount, receipt) => razorpay.orders.create({
  amount: Math.round(amount * 100),
  currency: 'INR',
  receipt,
});

const verifySignature = ({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature }) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};

const verifyWebhookSignature = (rawBody, signature) => {
  const expected = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
  return expected === signature;
};

module.exports = { createRazorpayOrder, verifySignature, verifyWebhookSignature, razorpay };
