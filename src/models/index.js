const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user.model')(sequelize, Sequelize.DataTypes);
const Post = require('./post.model')(sequelize, Sequelize.DataTypes);
const Comment = require('./comment.model')(sequelize, Sequelize.DataTypes);
const Interaction = require('./interaction.model')(sequelize, Sequelize.DataTypes);
const Follow = require('./follow.model')(sequelize, Sequelize.DataTypes);

// Define Associations
Object.keys(User.associate).forEach(associationMethod => {
  User.associate[associationMethod](sequelize.models);
});

Object.keys(Post.associate).forEach(associationMethod => {
  Post.associate[associationMethod](sequelize.models);
});

module.exports = {
  sequelize,
  Sequelize,
  User,
  Post,
  Comment,
  Interaction,
  Follow
};