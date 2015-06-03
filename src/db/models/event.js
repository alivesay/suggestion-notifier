'use strict';
module.exports = function(sequelize, DataTypes) {
  var Template = sequelize.define('Event', {
    type: DataTypes.STRING,
    body: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Event;
};