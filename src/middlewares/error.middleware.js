const logger = require('../services/logger.service');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { 
    stack: err.stack, 
    method: req.method, 
    path: req.path 
  });

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;