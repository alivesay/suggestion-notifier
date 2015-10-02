'use strict';

var Mentat = require('mentat');

module.exports = new Mentat.Handler('Notices', {
  routes: [
    { method: 'POST', path: '/api/notices' }
  ],

  POST: function (request, reply) {
    return Mentat.controllers.NoticesController.sendNotice({
        patronId: request.payload.patronId,
        suggestionId: request.payload.suggestionId,
        template: request.payload.template,
        bibNumber: request.payload.bibNumber
      },
      Mentat.Handler.buildDefaultResponder(reply));
  }
});
