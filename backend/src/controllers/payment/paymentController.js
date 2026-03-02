const PaymentTransaction = require('../../models/PaymentTransaction');
const Order = require('../../models/Order');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { createRazorpayOrder, verifySignature, verifyWebhookSignature, razorpay } = require('../../services/paymentService');

const createOrderPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.body.orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  const rpOrder = await createRazorpayOrder(order.pricing.total, `order_${order._id}`);
  const tx = await PaymentTransaction.create({ order: order._id, razorpayOrderId: rpOrder.id, amount: order.pricing.total });
  res.json({ razorpayOrder: rpOrder, transaction: tx });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const isValid = verifySignature(req.body);
  if (!isValid) throw new ApiError(400, 'Invalid payment signature');
  const tx = await PaymentTransaction.findOneAndUpdate(
    { razorpayOrderId: req.body.razorpay_order_id },
    { razorpayPaymentId: req.body.razorpay_payment_id, signature: req.body.razorpay_signature, status: 'CAPTURED' },
    { new: true },
  );
  await Order.findByIdAndUpdate(tx.order, { 'payment.status': 'SUCCESS', 'payment.transactionId': tx.razorpayPaymentId, status: 'CONFIRMED' });
  res.json({ success: true, tx });
});

const webhookHandler = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = JSON.stringify(req.body);
  if (!verifyWebhookSignature(rawBody, signature)) throw new ApiError(400, 'Invalid webhook signature');
  if (req.body.event === 'payment.failed') {
    await PaymentTransaction.findOneAndUpdate(
      { razorpayPaymentId: req.body.payload.payment.entity.id },
      { status: 'FAILED', payload: req.body },
    );
  }
  res.json({ received: true });
});

const refundPayment = asyncHandler(async (req, res) => {
  const tx = await PaymentTransaction.findById(req.params.id);
  const refund = await razorpay.payments.refund(tx.razorpayPaymentId, { amount: Math.round(tx.amount * 100) });
  tx.status = 'REFUNDED';
  tx.payload = { ...tx.payload, refund };
  await tx.save();
  await Order.findByIdAndUpdate(tx.order, { 'payment.status': 'REFUNDED', status: 'CANCELLED' });
  res.json(refund);
});

module.exports = { createOrderPayment, verifyPayment, webhookHandler, refundPayment };
