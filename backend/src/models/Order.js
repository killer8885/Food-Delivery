const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    quantity: Number,
    price: Number,
  }],
  pricing: {
    subtotal: Number,
    deliveryFee: Number,
    tax: Number,
    discount: Number,
    walletUsed: Number,
    total: Number,
  },
  payment: {
    method: { type: String, enum: ['COD', 'RAZORPAY'], default: 'RAZORPAY' },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    transactionId: String,
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
  },
  address: {
    line1: String,
    city: String,
    pincode: String,
    location: { lat: Number, lng: Number },
  },
  timeline: [{ status: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
