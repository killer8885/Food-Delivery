const Restaurant = require('../../models/Restaurant');
const MenuItem = require('../../models/MenuItem');
const Rating = require('../../models/Rating');
const asyncHandler = require('../../utils/asyncHandler');
const { getCache, setCache } = require('../../services/cacheService');

const addRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json(restaurant);
});

const listRestaurants = asyncHandler(async (req, res) => {
  const cached = await getCache('restaurants:list');
  if (cached) return res.json(cached);
  const restaurants = await Restaurant.find().populate('owner', 'name email');
  await setCache('restaurants:list', restaurants, 120);
  res.json(restaurants);
});

const getRestaurantDetails = asyncHandler(async (req, res) => {
  const [restaurant, menu] = await Promise.all([
    Restaurant.findById(req.params.id).populate('owner', 'name'),
    MenuItem.find({ restaurant: req.params.id, isAvailable: true }),
  ]);
  res.json({ restaurant, menu });
});

const addMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json(item);
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

const rateRestaurant = asyncHandler(async (req, res) => {
  const rating = await Rating.create({ ...req.body, user: req.user._id, restaurant: req.params.id });
  const stats = await Rating.aggregate([
    { $match: { restaurant: rating.restaurant } },
    { $group: { _id: '$restaurant', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Restaurant.findByIdAndUpdate(rating.restaurant, { avgRating: stats[0].avg, totalRatings: stats[0].count });
  res.status(201).json(rating);
});

module.exports = { addRestaurant, listRestaurants, getRestaurantDetails, addMenuItem, updateMenuItem, deleteMenuItem, rateRestaurant };
