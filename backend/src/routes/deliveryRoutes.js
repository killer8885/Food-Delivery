const express = require('express');
const ctrl = require('../controllers/delivery/deliveryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(protect, authorize('DELIVERY_PARTNER'));
router.get('/orders', ctrl.getAvailableOrders);
router.post('/orders/:id/accept', ctrl.acceptOrder);
router.post('/orders/:id/reject', ctrl.rejectOrder);
router.post('/location', ctrl.updateLocation);
router.get('/earnings', ctrl.earnings);
module.exports = router;
