'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Suggestions', 'suggestionType', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'patron',
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Suggestions', 'suggestionType');
  }
};
