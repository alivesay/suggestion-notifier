'use strict';

var Mentat = require('mentat');

Mentat.models.User.hook('afterCreate', function (user, options) {
  Mentat.controllers.EventsController.log({
    event: {
      type: 'users:created',
      body: user.dataValues
    },
    logFields: [ 'username' , 'isAdmin', 'isAuthorized' ]
  });
});

Mentat.models.User.hook('afterUpdate', function (user, options) {
  Mentat.controllers.EventsController.log({
    event: {
      type: 'users:updated',
      body: user.dataValues
    },
    logFields: [ 'username', 'isAdmin', 'isAuthorized' ]
  });
});

Mentat.models.User.hook('afterDestroy', function (user, options) {
  Mentat.controllers.EventsController.log({
    event: {
      type: 'users:deleted',
      body: user.dataValues
    },
    logFields: [ 'username', 'isAdmin', 'isAuthorized' ]
  });
});

function getUsers(options, callback) {
    options.queryOptions = {
        where: {
            username: {
                $ne: 'admin'
            }
        },
        attributes: {
            exclude: [ 'password' ]
        }
    };

    Mentat.models.User
        .findAll(options.queryOptions)
        .nodeify(callback);
}

function updateUser(options, callback) {
    options.queryOptions = {
        attributes: {
            exclude: [ 'password', 'username' ]
        }
    };

    Mentat.models.User
        .find({
            where: {
                id: options.id
            }
        })
        .then(function (user) {
            if (options.settings) {
                user
                    .update(options.settings, options.queryOptions)
                    .nodeify(callback);
            } else {
                return callback();
            }
        });
}        

module.exports = new Mentat.Controller('Users', {
    getUsers: getUsers,
    updateUser: updateUser
});
