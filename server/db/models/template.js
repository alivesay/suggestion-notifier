module.exports = function(sequelize, DataTypes) {
  var Template = sequelize.define('Template', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    html: DataTypes.STRING,
    bibRequired: DataTypes.BOOLEAN,
    sendCopy: DataTypes.BOOLEAN,
    copyEmail: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Template;
};
