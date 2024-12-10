const rateLimit = require('express-rate-limit');

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour window
  max: 5,  // limit each IP to 5 requests per windowMs
  message: "Too many accounts created from this IP, please try again after an hour"
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  createAccountLimiter,
  apiLimiter
};