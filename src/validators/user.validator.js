const Joi = require('joi');
const validateRequest = require('../middlewares/validation.middleware');

const userSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  validateUserRegistration: validateRequest(userSchema),
};
