'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Suggestions', 'author', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    })
      .then(function () {
        return queryInterface.changeColumn('Suggestions', 'subject', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: ''
        })
      })
      .then(function () {
        return queryInterface.changeColumn('Suggestions', 'author', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: ''
        })
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Suggestions', 'author', {
      type: Sequelize.STRING,
      allowNull: false
    })
      .then(function () {
        return queryInterface.changeColumn('Suggestions', 'subject', {
          type: Sequelize.STRING,
          allowNull: false
        })
      })
      .then(function () {
        return queryInterface.changeColumn('Suggestions', 'author', {
          type: Sequelize.STRING,
          allowNull: false
        })
      });
  }
};
