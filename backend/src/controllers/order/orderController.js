const Cart = require('../../models/Cart');
const Order = require('../../models/Order');
const User = require('../../models/User');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');

const createOrder = (io) => asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
  if (!cart || !cart.items.length) throw new ApiError(400, 'Cart is empty');
  const subtotal = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discount = 0;
  const deliveryFee = 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax - discount - (cart.walletUsed || 0);
  const order = await Order.create({
    user: req.user._id,
    restaurant: cart.restaurant,
    items: cart.items.map((i) => ({ menuItem: i.menuItem._id, name: i.menuItem.name, quantity: i.quantity, price: i.price })),
    pricing: { subtotal, discount, deliveryFee, tax, walletUsed: cart.walletUsed || 0, total },
    status: 'PENDING',
    timeline: [{ status: 'PENDING' }],
    address: req.body.address,
  });
  io.emit('new-order', order);
  res.status(201).json(order);
});

const updateOrderStatus = (io) => asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  order.status = status;
  order.timeline.push({ status });
  await order.save();
  io.to(`order:${order._id}`).emit('order-status-updated', order);
  res.json(order);
});

const assignDeliveryPartner = asyncHandler(async (req, res) => {
  const { orderId, deliveryPartnerId } = req.body;
  const partner = await User.findById(deliveryPartnerId);
  if (!partner || partner.role !== 'DELIVERY_PARTNER') throw new ApiError(400, 'Invalid delivery partner');
  const order = await Order.findByIdAndUpdate(orderId, { deliveryPartner: partner._id, status: 'PICKED_UP' }, { new: true });
  res.json(order);
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)) throw new ApiError(400, 'Order cannot be cancelled now');
  order.status = 'CANCELLED';
  order.timeline.push({ status: 'CANCELLED' });
  await order.save();
  res.json(order);
});

module.exports = { createOrder, updateOrderStatus, assignDeliveryPartner, cancelOrder };
