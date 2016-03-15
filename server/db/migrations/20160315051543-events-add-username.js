'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('Events', 'username', {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('Events', 'username');
    }
};
