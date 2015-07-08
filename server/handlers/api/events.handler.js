'use strict';

var Mentat = require('mentat');

module.exports = new Mentat.Handler('Events', {
  routes: [
    { method: 'GET', path: '/api/events' }
  ],

  GET: function (request, reply) {
    return Mentat.controllers.EventsController.getEvents({
      queryOptions: {
        limit: request.query.limit,
        order: 'updatedAt DESC'
      }
    }, Mentat.Handler.buildDefaultResponder(reply));
  }
});