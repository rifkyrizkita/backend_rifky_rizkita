'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Blog.belongsTo(models.User)
      Blog.belongsTo(models.Category)
      Blog.hasOne(models.Like)
      
    }
  }
  Blog.init({
    title: {type:DataTypes.STRING, allowNull:false},
    author:{type:DataTypes.STRING, allowNull:false},
    imgBlog: {type:DataTypes.STRING, allowNull:false},
    content: {type:DataTypes.STRING(500), allowNull:false},
    link: DataTypes.STRING,
    keywords: {type:DataTypes.STRING, allowNull:false},
    country: {type:DataTypes.STRING, allowNull:false},
    isDeleted: {type:DataTypes.BOOLEAN, allowNull:false, defaultValue:false}
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};