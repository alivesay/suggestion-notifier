var Mentat = require('mentat');
var ldap = require('ldapjs');

var ldapServer = ldap.createServer();

function ldapFindUser(username, callback) {
    var client = ldap.createClient({
        url: 'ldaps://' + Mentat.settings.auth.ldap.server + ':' + Mentat.settings.auth.ldap.port,
        tlsOptions: {
            rejectUnauthorized: !!Mentat.settings.auth.ldap.rejectUnauthorized
        }
    });

    var opts = {
        filter: (Mentat.settings.auth.ldap.ldapFilterAttribute || 'sAMAccountName') + '=' + username,
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
                client.unbind();

                if (!targetDN) {
                    return callback(false, 'invalid user');
                }

                return callback(true);
            });
        });
    });
}


module.exports = function (decoded, request, callback) {
  Mentat.models.User
    .findOne({where: { username: decoded.username }})
    .nodeify(function (err, user) {
      Mentat.Namespace.set('username', decoded.username);
      Mentat.Namespace.set('useremail', user.email);

      if (user && !err) {
        if (user.isAuthorized) {
            return callback(null, true);
        } else {
            return callback(null, false);
        }
      }

      if (Mentat.settings.auth.useLDAP) {
        ldapFindUser(decoded.username, function findUserDone (result, err) {
          return callback(null, true);
        });
      } else {
        return callback(null, false);
      }
    });
};
