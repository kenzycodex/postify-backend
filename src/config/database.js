import { Sequelize } from 'sequelize';
import logger from './logger';

// Initialize Sequelize connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Disable SQL query logging
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

// Function to initialize and synchronize DB
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Sync models for development environments
    await sequelize.sync({ alter: false });
    logger.info('Database models synced successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database', error);
    process.exit(1);
  }
};

export { sequelize, initializeDatabase };
