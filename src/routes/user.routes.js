// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validation.middleware');
const { updateProfileValidation } = require('../validators/user.validator');

// Get current user profile
router.get('/me', authMiddleware, userController.getCurrentUserProfile);

// Update user profile
router.put(
    '/me', 
    authMiddleware, 
    uploadMiddleware.single('profilePicture'),
    validate(updateProfileValidation),
    userController.updateProfile
);

// Get user's posts
router.get('/posts', authMiddleware, userController.getUserPosts);

// Follow/Unfollow user
router.post('/follow/:id', authMiddleware, userController.followUser);
router.delete('/follow/:id', authMiddleware, userController.unfollowUser);

// Get user's followers and following
router.get('/:id/followers', authMiddleware, userController.getUserFollowers);
router.get('/:id/following', authMiddleware, userController.getUserFollowing);

module.exports = router;