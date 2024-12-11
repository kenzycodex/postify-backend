const { User } = require('../models');

const roleMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).send({ error: 'Unauthorized access' });
      }

      const hasRole = roles.includes(req.user.role);
      if (!hasRole) {
        return res.status(403).send({ error: 'You do not have permission to perform this action' });
      }

      next();
    } catch (error) {
      res.status(500).send({ error: 'Server Error' });
    }
  };
};

module.exports = roleMiddleware;
