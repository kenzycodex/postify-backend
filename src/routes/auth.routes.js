const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  verifyEmail, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/auth.controller');
const { 
  registerValidation, 
  loginValidation 
} = require('../validators/auth.validator');
const validate = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', authMiddleware, resetPassword);

module.exports = router;