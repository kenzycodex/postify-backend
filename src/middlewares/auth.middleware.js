const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../services/logger.service');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication middleware error', {
      stack: error.stack,
      message: error.message,
    });

    res.status(401).send({ error: 'Unauthorized - Authentication Failed' });
  }
};

module.exports = authMiddleware;
