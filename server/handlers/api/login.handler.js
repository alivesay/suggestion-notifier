var Mentat = require('mentat');
var Boom = require('boom');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var redis = require('redis');

var client = redis.createClient();

module.exports = new Mentat.Handler('Login', {
    routes: [
        { method: 'POST', path: '/api/login', auth: false },
        { method: 'GET', path: '/api/logout' }
    ],

    POST: function (request, reply) {
        Mentat.models.User
            .findOne({where: { username: request.payload.username }})
            .nodeify(function (err, user) {
                if (err) {
                    return reply(Boom.unauthorized(err));
                }

                if (!user) {
                    return reply(Boom.unauthorized('invalid user'));
                }

                if (bcrypt.compareSync(request.payload.password, user.password)) {
                    var tokenPayload = {
                        username: user.username
                    };

                    var token = jwt.sign(tokenPayload, Mentat.settings.auth.key, {
                        expiresInMinutes: Mentat.settings.auth.tokenTTL
                    });

                    return reply({token: token});
                }

                return reply(Boom.unauthorized('invalid password'));
            });
    },

    GET: function (request, reply) {
        var authorization = request.headers['authorization'];

        if (authorization) {
            var token = authorization.substr(authorization.indexOf(' ') + 1);
            client.setex([ token, Mentat.settings.auth.tokenTTL * 60,  { expired: true } ], function (err) {
                if (err) {
                    return reply(Boom.badImplementation('redis broke', err));
                }
                return reply();
            });
        }
    }
});
