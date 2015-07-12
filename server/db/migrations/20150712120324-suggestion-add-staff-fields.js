'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Suggestions', 'price', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    })
      .then(function () {
        return queryInterface.addColumn('Suggestions', 'notes', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: ''
        })
      })
      .then(function () {
        return queryInterface.addColumn('Suggestions', 'email', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: ''
        })
      })
      .then(function () {
        return queryInterface.addColumn('Suggestions', 'location', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: ''
        })
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Suggestions', 'price')
      .then(function () {
        return queryInterface.removeColumn('Suggestions', 'notes');
      })
      .then(function () {
        return queryInterface.removeColumn('Suggestions', 'email');
      })
      .then(function () {
        return queryInterface.removeColumn('Suggestions', 'location');
      })
  }
};
