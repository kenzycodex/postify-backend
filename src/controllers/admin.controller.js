// src/controllers/admin.controller.js
const { User, Post, sequelize } = require('../models');
const { Op } = require('sequelize');

class AdminController {
    async getAllUsers(req, res) {
        try {
            const { 
                page = 1, 
                limit = 20, 
                search = '', 
                role 
            } = req.query;

            const whereClause = {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } }
                ]
            };

            if (role) {
                whereClause.role = role;
            }

            const { count, rows: users } = await User.findAndCountAll({
                where: whereClause,
                attributes: { 
                    exclude: ['password', 'verificationToken'] 
                },
                limit,
                offset: (page - 1) * limit,
                order: [['createdAt', 'DESC']]
            });

            res.json({
                users,
                totalUsers: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit)
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error fetching users', 
                error: error.message 
            });
        }
    }

    async deleteUser(req, res) {
        const transaction = await sequelize.transaction();

        try {
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                await transaction.rollback();
                return res.status(404).json({ 
                    message: 'User not found' 
                });
            }

            // Cascading delete with transaction
            await user.destroy({ transaction });
            await transaction.commit();

            res.json({ 
                message: 'User deleted successfully' 
            });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ 
                message: 'Error deleting user', 
                error: error.message 
            });
        }
    }

    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ 
                    message: 'User not found' 
                });
            }

            await user.update({ role });

            res.json({ 
                message: 'User role updated successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error updating user role', 
                error: error.message 
            });
        }
    }

    async getSystemAnalytics(req, res) {
        try {
            const analytics = {
                users: {
                    total: await User.count(),
                    byRole: await User.count({
                        group: ['role']
                    }),
                    newUsersLastMonth: await User.count({
                        where: {
                            createdAt: {
                                [Op.gte]: new Date(
                                    new Date() - 30 * 24 * 60 * 60 * 1000
                                )
                            }
                        }
                    })
                },
                posts: {
                    total: await Post.count(),
                    lastMonthPosts: await Post.count({
                        where: {
                            createdAt: {
                                [Op.gte]: new Date(
                                    new Date() - 30 * 24 * 60 * 60 * 1000
                                )
                            }
                        }
                    })
                }
            };

            res.json(analytics);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error fetching system analytics', 
                error: error.message 
            });
        }
    }
}

module.exports = new AdminController();