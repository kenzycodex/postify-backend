// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// User Management
router.get('/users', 
    authMiddleware, 
    roleMiddleware(['admin']),
    adminController.getAllUsers
);

router.delete('/users/:id', 
    authMiddleware, 
    roleMiddleware(['admin']),
    adminController.deleteUser
);

router.put('/users/:id/role', 
    authMiddleware, 
    roleMiddleware(['admin']),
    adminController.updateUserRole
);

// Post Moderation
router.get('/posts', 
    authMiddleware, 
    roleMiddleware(['admin', 'moderator']),
    adminController.getAllPosts
);

router.delete('/posts/:id', 
    authMiddleware, 
    roleMiddleware(['admin', 'moderator']),
    adminController.deletePost
);

// Analytics
router.get('/analytics', 
    authMiddleware, 
    roleMiddleware(['admin']),
    adminController.getSystemAnalytics
);

module.exports = router;