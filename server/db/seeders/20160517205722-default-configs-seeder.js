'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('configs', [{
        id: 1,
        key: 'app.settings',
        value: '{ "adminEmail": "root@localhost" }',
	    createdAt: '1978-08-14 00:00:00.000 +00:00',
     	updatedAt: '1978-08-14 00:00:00.000 +00:00'
      }], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('configs', null, {});
  }
};
