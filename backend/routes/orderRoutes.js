const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, controller.placeOrder);
router.get('/', authenticate, controller.getOrders); 

module.exports = router;
