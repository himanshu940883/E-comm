const express = require('express');
const router = express.Router();
const controller = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, controller.addToCart);  // Add product to cart
router.get('/', authenticate, controller.viewCart);    // View cart

module.exports = router;
