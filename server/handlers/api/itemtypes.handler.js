'use strict';

var Mentat = require('mentat');
var _ = require('lodash');

module.exports = new Mentat.Handler('Itemtypes', {
  routes: [
    { method: 'GET', path: '/api/itemtypes' }
  ],

  GET: function (request, reply) {
    var itemtypes = _.get(Mentat.settings, 'ilsOptions.itemTypes', {
      error: 'Set ilsOptions.itemTypes in settings.js!'
    });

    reply(itemtypes).code(200);
  }
});