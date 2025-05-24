const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');

router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);

router.post('/', authenticate, controller.addProduct);
router.put('/:id', authenticate, controller.updateProduct);
router.delete('/:id', authenticate, controller.deleteProduct);

module.exports = router;
