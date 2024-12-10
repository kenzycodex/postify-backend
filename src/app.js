// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const { sequelize } = require('./models');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./services/logger.service');
const { apiLimiter } = require('./middlewares/rate.limiter.middleware');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Performance Middlewares
app.use(compression());
app.use(apiLimiter);

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;