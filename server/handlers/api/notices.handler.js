'use strict';

var Mentat = require('mentat');

module.exports = new Mentat.Handler('Notices', {
  routes: [
    { method: 'POST', path: '/api/notices' }
  ],

  POST: function (request, reply) {
    var options = {
      bibNumber: request.payload.bibNumber
    };

    return Mentat.controllers.NoticesController.sendNotice(
      0, //request.payload.patronId,
      request.payload.suggestionId,
      request.payload.template,
      options,
      Mentat.Handler.buildDefaultResponder(reply));
  }

});