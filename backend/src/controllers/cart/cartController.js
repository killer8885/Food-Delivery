const Cart = require('../../models/Cart');
const MenuItem = require('../../models/MenuItem');
const asyncHandler = require('../../utils/asyncHandler');
const { applyCoupon } = require('../../services/couponService');

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem coupon');
  res.json(cart || { items: [] });
});

const addToCart = asyncHandler(async (req, res) => {
  const { menuItemId, quantity = 1 } = req.body;
  const menuItem = await MenuItem.findById(menuItemId);
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, restaurant: menuItem.restaurant, items: [] });
  const existing = cart.items.find((item) => item.menuItem.toString() === menuItemId);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ menuItem: menuItem._id, quantity, price: menuItem.price });
  await cart.save();
  res.json(cart);
});

const applyCartCoupon = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const { discount, coupon } = await applyCoupon(req.body.code, subtotal);
  if (coupon) cart.coupon = coupon._id;
  await cart.save();
  res.json({ cart, subtotal, discount });
});

module.exports = { getCart, addToCart, applyCartCoupon };
