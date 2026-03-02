const express = require('express');
const ctrl = require('../controllers/payment/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.post('/create-order', protect, ctrl.createOrderPayment);
router.post('/verify', protect, ctrl.verifyPayment);
router.post('/webhook', ctrl.webhookHandler);
router.post('/refund/:id', protect, ctrl.refundPayment);
module.exports = router;
