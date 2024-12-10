const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { 
  registerValidation, 
  loginValidation, 
  resetPasswordValidation 
} = require('../validators/auth.validator');
const validate = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { createAccountLimiter } = require('../middlewares/rate.limiter.middleware');

// Public Routes
router.post(
  '/register', 
  createAccountLimiter, 
  validate(registerValidation), 
  authController.register
);
router.post(
  '/login', 
  validate(loginValidation), 
  authController.login
);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);

// Protected Routes
router.post(
  '/reset-password', 
  authMiddleware, 
  validate(resetPasswordValidation), 
  authController.resetPassword
);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;