const Order = require('../../models/Order');
const Restaurant = require('../../models/Restaurant');
const MenuItem = require('../../models/MenuItem');
const User = require('../../models/User');
const PaymentTransaction = require('../../models/PaymentTransaction');
const Coupon = require('../../models/Coupon');
const asyncHandler = require('../../utils/asyncHandler');

const analytics = asyncHandler(async (req, res) => {
  const revenue = await Order.aggregate([{ $match: { status: 'DELIVERED' } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]);
  const topRestaurants = await Order.aggregate([{ $group: { _id: '$restaurant', orders: { $sum: 1 } } }, { $sort: { orders: -1 } }, { $limit: 5 }]);
  const mostOrderedItems = await Order.aggregate([{ $unwind: '$items' }, { $group: { _id: '$items.name', count: { $sum: '$items.quantity' } } }, { $sort: { count: -1 } }, { $limit: 10 }]);
  const activeUsers = await User.countDocuments({ isActive: true });
  const paymentLogs = await PaymentTransaction.find().sort({ createdAt: -1 }).limit(20);
  const couponUsage = await Coupon.find({}, 'code usedCount');
  res.json({
    revenue: revenue[0]?.total || 0,
    topRestaurants,
    mostOrderedItems,
    activeUsers,
    paymentLogs,
    couponUsage,
    restaurantsCount: await Restaurant.countDocuments(),
    menuItemsCount: await MenuItem.countDocuments(),
  });
});

module.exports = { analytics };
