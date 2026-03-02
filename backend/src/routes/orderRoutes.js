const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/order/orderController');

module.exports = (io) => {
  const router = express.Router();
  router.post('/', protect, authorize('USER'), controller.createOrder(io));
  router.patch('/:id/status', protect, authorize('OWNER', 'ADMIN', 'DELIVERY_PARTNER'), controller.updateOrderStatus(io));
  router.post('/assign-delivery', protect, authorize('ADMIN'), controller.assignDeliveryPartner);
  router.post('/:id/cancel', protect, authorize('USER', 'ADMIN'), controller.cancelOrder);
  return router;
};
