const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/register', controller.register);     // Register a new user
router.post('/login', controller.login);           // Login user

module.exports = router;
