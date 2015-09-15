'use strict';

var bcrypt = require('bcrypt');

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('users', [{
        id: 1,
        username: 'admin',
        isAdmin: true,
	password: bcrypt.hashSync('default', 10),
	createdAt:  (new Date).getTime(),
	updatedAt: (new Date).getTime()
      }], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('users', null, {});
  }
};
