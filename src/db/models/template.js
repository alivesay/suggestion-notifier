'use strict';
module.exports = function(sequelize, DataTypes) {
  var Template = sequelize.define('Template', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    bibRequired: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Template;
};