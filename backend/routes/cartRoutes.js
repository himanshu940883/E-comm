const express = require('express');
const router = express.Router();
const controller = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, controller.addToCart);
router.get('/', authenticate, controller.viewCart);
router.get('/:productId', authenticate, controller.getCartItemById);
router.put('/:productId', authenticate, controller.updateCartItem);
router.delete('/:productId', authenticate, controller.deleteCartItemById);

module.exports = router;
