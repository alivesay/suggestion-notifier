'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('Templates', 'html', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: ''
      });
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('Templates', 'html');
  }
};
