var Mentat = require('mentat');

module.exports = function (decoded, request, callback) {
  Mentat.models.User
    .findOne({where: { username: decoded.username }})
    .nodeify(function (err, user) {
      if (err || !user) {
        return callback(null, false);
      }

      return callback(null, true);
    });
};
