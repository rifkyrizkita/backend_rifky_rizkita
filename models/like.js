'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.User)
      Like.belongsTo(models.Blog)
    }
  }
  Like.init({
    isLiked: {type:DataTypes.BOOLEAN,defaultValue:false},
    
  }, {
    sequelize,
    modelName: 'Like',
    timestamps: false
  });
  return Like;
};