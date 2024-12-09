// src/controllers/user.controller.js
const { User, Post, Follow } = require('../models');
const cloudinaryService = require('../services/cloudinary.service');

class UserController {
    async getCurrentUserProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { 
                    exclude: ['password', 'verificationToken'] 
                },
                include: [
                    {
                        model: Post,
                        limit: 10,
                        order: [['createdAt', 'DESC']]
                    },
                    {
                        model: Follow,
                        as: 'followers',
                        include: [{ model: User, as: 'follower' }]
                    }
                ]
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error fetching user profile', 
                error: error.message 
            });
        }
    }

    async updateProfile(req, res) {
        try {
            const { username, bio, email } = req.body;
            const user = await User.findByPk(req.user.id);

            // Handle profile picture upload
            let profilePictureUrl = user.profilePicture;
            if (req.file) {
                // Remove previous image if exists
                if (profilePictureUrl) {
                    await cloudinaryService.deleteImage(profilePictureUrl);
                }
                
                // Upload new image
                const uploadResult = await cloudinaryService.uploadImage(req.file);
                profilePictureUrl = uploadResult.secure_url;
            }

            // Update user details
            await user.update({
                username: username || user.username,
                email: email || user.email,
                profilePicture: profilePictureUrl,
                bio: bio || user.bio
            });

            res.json({
                message: 'Profile updated successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    bio: user.bio
                }
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error updating profile', 
                error: error.message 
            });
        }
    }

    async followUser(req, res) {
        try {
            const { id: targetUserId } = req.params;
            const currentUserId = req.user.id;

            // Prevent self-follow
            if (targetUserId === currentUserId) {
                return res.status(400).json({ 
                    message: 'You cannot follow yourself' 
                });
            }

            // Check if target user exists
            const targetUser = await User.findByPk(targetUserId);
            if (!targetUser) {
                return res.status(404).json({ 
                    message: 'User not found' 
                });
            }

            // Check if already following
            const existingFollow = await Follow.findOne({
                where: {
                    followerId: currentUserId,
                    followingId: targetUserId
                }
            });

            if (existingFollow) {
                return res.status(400).json({ 
                    message: 'Already following this user' 
                });
            }

            // Create follow relationship
            await Follow.create({
                followerId: currentUserId,
                followingId: targetUserId
            });

            res.status(201).json({ 
                message: 'Successfully followed user' 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error following user', 
                error: error.message 
            });
        }
    }
}

module.exports = new UserController();