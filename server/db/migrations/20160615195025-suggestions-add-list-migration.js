'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Suggestions', 'listRef', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: ''
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Suggestions', 'listRef');
  }
};
