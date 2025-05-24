const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentController');

router.get('/status', controller.testPayment); 

module.exports = router;
