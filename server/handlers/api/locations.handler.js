'use strict';

var Mentat = require('mentat');
var _ = require('lodash');

module.exports = new Mentat.Handler('Locations', {
  routes: [
    { method: 'GET', path: '/api/locations' }
  ],

  GET: function (request, reply) {
    var itemtypes = _.get(Mentat.settings, 'ilsOptions.locations', {
      error: 'Set ilsOptions.locations in settings.js!'
    });

    reply(itemtypes).code(200);
  }
});