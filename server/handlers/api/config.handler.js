'use strict';

var Mentat = require('mentat');

module.exports = new Mentat.Handler('Configs', {
  routes: [
    { method: 'GET', path: '/api/config/{key}' },
    { method: 'POST', path: '/api/config/{key}' }
  ],

  GET: function (request, reply) {
    return Mentat.controllers.ConfigsController
      .get({ key: request.params.key },
           Mentat.Handler.buildDefaultResponder(reply));
  },

  POST: function (request, reply) {
    return Mentat.controllers.ConfigsController
      .set({ key: request.params.key , value: request.payload },
           Mentat.Handler.buildDefaultResponder(reply));
  }
});
