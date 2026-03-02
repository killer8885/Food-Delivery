const express = require('express');
const { analytics } = require('../controllers/admin/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.get('/analytics', protect, authorize('ADMIN'), analytics);
module.exports = router;
