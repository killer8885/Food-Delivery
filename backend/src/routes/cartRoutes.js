const express = require('express');
const ctrl = require('../controllers/cart/cartController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(protect, authorize('USER'));
router.get('/', ctrl.getCart);
router.post('/items', ctrl.addToCart);
router.post('/coupon', ctrl.applyCartCoupon);
module.exports = router;
