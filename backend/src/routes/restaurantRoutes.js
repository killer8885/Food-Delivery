const express = require('express');
const ctrl = require('../controllers/restaurant/restaurantController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.get('/', ctrl.listRestaurants);
router.get('/:id', ctrl.getRestaurantDetails);
router.post('/', protect, authorize('ADMIN'), ctrl.addRestaurant);
router.post('/:id/rate', protect, authorize('USER'), ctrl.rateRestaurant);
router.post('/menu', protect, authorize('OWNER', 'ADMIN'), ctrl.addMenuItem);
router.put('/menu/:id', protect, authorize('OWNER', 'ADMIN'), ctrl.updateMenuItem);
router.delete('/menu/:id', protect, authorize('OWNER', 'ADMIN'), ctrl.deleteMenuItem);
module.exports = router;
