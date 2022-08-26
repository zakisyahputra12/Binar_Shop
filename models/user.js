'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Order, {
        foreignKey: { name: 'user_id', allowNull: false },
        as: 'orders',
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    is_admin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};