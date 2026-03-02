const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  signature: String,
  amount: Number,
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['CREATED', 'CAPTURED', 'FAILED', 'REFUNDED'], default: 'CREATED' },
  payload: Object,
}, { timestamps: true });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
