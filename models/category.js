'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: false,
      primaryKey: true
    }

  },
    {});
  Category.associate = function (models) {
    Category.hasMany(models.Restaurant)
  };
  return Category;
};