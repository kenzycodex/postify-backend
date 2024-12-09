module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      visibility: {
        type: DataTypes.ENUM('public', 'private', 'friends'),
        defaultValue: 'public'
      },
      likesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      commentsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    });
  
    Post.associate = (models) => {
      Post.belongsTo(models.User);
      Post.hasMany(models.Comment);
      Post.belongsToMany(models.User, { 
        through: 'Likes',
        as: 'Likers'
      });
    };
  
    return Post;
  };