var Mentat = require('mentat');
var packageJson = require('../../../package.json');

module.exports = new Mentat.Handler('Util', {
  routes: [
    { method: 'GET', path: '/api/version', auth: false }
  ],

  GET: function (request, reply) {
    reply({ version: packageJson.version });
  }
});
