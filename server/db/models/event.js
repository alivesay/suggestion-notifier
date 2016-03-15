module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    type: DataTypes.STRING,
    body: DataTypes.STRING,
    username: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Event;
};
