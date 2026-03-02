const Order = require('../../models/Order');
const DeliveryLocation = require('../../models/DeliveryLocation');
const asyncHandler = require('../../utils/asyncHandler');

const getAvailableOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: 'CONFIRMED', deliveryPartner: null });
  res.json(orders);
});

const acceptOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { deliveryPartner: req.user._id, status: 'PICKED_UP' },
    { new: true },
  );
  res.json(order);
});

const rejectOrder = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Order rejected' });
});

const updateLocation = asyncHandler(async (req, res) => {
  const location = await DeliveryLocation.findOneAndUpdate(
    { deliveryPartner: req.user._id },
    { location: req.body.location, heading: req.body.heading },
    { upsert: true, new: true },
  );
  res.json(location);
});

const earnings = asyncHandler(async (req, res) => {
  const delivered = await Order.find({ deliveryPartner: req.user._id, status: 'DELIVERED' });
  const total = delivered.length * 35;
  res.json({ deliveredOrders: delivered.length, totalEarnings: total });
});

module.exports = { getAvailableOrders, acceptOrder, rejectOrder, updateLocation, earnings };
