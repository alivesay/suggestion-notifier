var Mentat = require('mentat');
var Boom = require('boom');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var redis = require('redis');
var ldap = require('ldapjs');

var client = redis.createClient();

var ldapServer = ldap.createServer();

// TODO: this all needs to be refactored O_o

function ldapAuth(username, password, callback) {
    var client = ldap.createClient({
        url: 'ldaps://' + Mentat.settings.auth.ldap.server + ':' + Mentat.settings.auth.ldap.port,
        tlsOptions: {
            rejectUnauthorized: !!Mentat.settings.auth.ldap.rejectUnauthorized
        }
    });

    var ldapFilterAttribute = Mentat.settings.auth.ldap.ldapFilterAttribute || 'sAMAccountName';
    var opts = {
        filter: '(&(objectclass=user)('+ ldapFilterAttribute + '=' + username + '))',
        scope: 'sub'
    };

    var rootDN = Mentat.settings.auth.ldap.rootDN || '';
    
    var targetDN;
    var serviceAccountDN = Mentat.settings.auth.ldap.serviceAccountDN;
    var serviceAccountPassword = Mentat.settings.auth.ldap.serviceAccountPassword;

    client.bind(serviceAccountDN, serviceAccountPassword, function initialBindDone (err) {
        if (err) {
            return callback(false, err);
        }

        client.search(rootDN, opts, function ldapSearchDone (err, result) {
            if (err) {
                return callback(false, err);
            }

            result.on('error', function onSearchError (err) {
                return callback(false, err);
            });

            result.on('searchEntry', function onSearchEntry (entry) {
                targetDN = entry.objectName;
            });

            result.on('end', function onSearchEnd (entry) {

                if (!targetDN) {
                    return callback(false, 'invalid user');
                }

                client.bind(targetDN, password, function ldapBindDone (err) {
                    client.unbind();

                    if (err) {
                        return callback(false, 'invalid password');
                    }

                    return callback(true);
                });
            });
        });
    });
}

function ldapAuthResponder(username, password, callback) {
    ldapAuth(username, password, function ldapAuthDone (result, err) {
        if (result) {
            return callback(createJwtToken(username));
        }

        return callback(Boom.unauthorized(err));
    });
}

function createJwtToken(username) {
    var tokenPayload = {
        username: username
    };

    var token = jwt.sign(tokenPayload, Mentat.settings.auth.key, {
        expiresIn: Mentat.settings.auth.tokenTTL
    });
    
    return { token: token };
}

module.exports = new Mentat.Handler('Auth', {
    routes: [
        { method: 'POST', path: '/api/login', auth: false, handler: 'login' },
        { method: 'GET', path: '/api/logout', handler: 'logout' }
    ],

    login: function (request, reply) {
        Mentat.models.User
            .findOne({where: { username: request.payload.username }})
            .nodeify(function (err, user) {
                if (err) {
                    return reply(Boom.unauthorized(err));
                }

                if (!user) {
                    if (!!Mentat.settings.auth.useLDAP) {
                       return ldapAuthResponder(request.payload.username, request.payload.password, reply); 
                    } else {
                        return reply(Boom.unauthorized('invalid user'));
                    }
                }

                if (bcrypt.compareSync(request.payload.password, user.password)) {
                    return reply(createJwtToken(user.username));
                } 

                return reply(Boom.unauthorized('invalid password'));
            });
    },

    logout: function (request, reply) {
        var authorization = request.headers['authorization'];

        if (authorization) {
            var token = authorization.substr(authorization.indexOf(' ') + 1);
            client.setex([ token, Mentat.settings.auth.tokenTTL,  { expired: true } ], function (err) {
                if (err) {
                    return reply(Boom.badImplementation('redis broke', err));
                }
                return reply();
            });
        }
    }
});
