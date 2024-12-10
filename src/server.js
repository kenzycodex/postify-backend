// src/server.js
const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./services/logger.service');

// Database connection and server start logic
const startServer = async () => {
  try {
    // Authenticate and sync database
    await sequelize.authenticate();
    await sequelize.sync();

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to initialize the server or connect to DB', error);
    process.exit(1);
  }
};

startServer();
