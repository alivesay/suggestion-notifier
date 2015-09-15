module.exports = function(sequelize, DataTypes) {
  var Suggestion = sequelize.define('Suggestion', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    publisher: DataTypes.STRING,
    isbn: DataTypes.STRING,
    type: DataTypes.STRING,
    subject: DataTypes.STRING,
    patron: DataTypes.STRING,
    isReferred: DataTypes.BOOLEAN,
    price: DataTypes.STRING,
    notes: DataTypes.STRING,
    email: DataTypes.STRING,
    location: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Suggestion;
};