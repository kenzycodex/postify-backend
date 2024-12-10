import dotenv from 'dotenv';
dotenv.config();

const environmentConfig = {
  development: {
    database: {
      url: process.env.DEV_DATABASE_URL,
      dialect: 'postgres',
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiration: '7d',
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
    },
  },
  production: {
    database: {
      url: process.env.PROD_DATABASE_URL,
      dialect: 'postgres',
      pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000,
      },
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiration: '30d',
    },
  },
};

const getConfig = (env = process.env.NODE_ENV || 'development') => {
  return environmentConfig[env] || environmentConfig.development;
};

export { getConfig };
