'use strict';

var bcrypt = require('bcrypt');

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('users', [{
        id: 1,
        username: 'admin',
        isAdmin: 1,
	password: bcrypt.hashSync('default', 10),
	createdAt: '1978-08-14 00:00:00.000 +00:00',
	updatedAt: '1978-08-14 00:00:00.000 +00:00'
      }], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('users', null, {});
  }
};
