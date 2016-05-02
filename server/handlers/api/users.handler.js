'use strict';

var Mentat = require('mentat');

module.exports = new Mentat.Handler('Users', {
    routes: [
        // this should require isAdmin
        { method: 'GET', path: '/api/users', handler: 'read' },
        { method: 'POST', path: '/api/users/{id}', handler: 'update' }
    ],

    read: function (request, reply) {
        return Mentat.controllers.UsersController.getUsers({},
            Mentat.Handler.buildDefaultResponder(reply));
    },

    update: function (request, reply) {
        return Mentat.controllers.UsersController.updateUser({
            id: request.params.id,
            settings: {
                isAdmin: request.payload.isAdmin,
                isAuthorized: request.payload.isAuthorized
            }
        }, Mentat.Handler.buildDefaultResponder(reply));
    }    

});
