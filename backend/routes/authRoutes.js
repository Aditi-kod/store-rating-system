const express = require('express');
const router = express.Router();
const { signup, login, getMe, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { userValidationRules, passwordValidationRules, validate } = require('../utils/validators');

// Public routes
router.post('/signup', userValidationRules, validate, signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-password', protect, passwordValidationRules, validate, updatePassword);

module.exports = router;