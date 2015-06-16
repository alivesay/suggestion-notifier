'use strict';

var Boom = require('boom');

var models = require('../../db/models');

module.exports = {
  all: function (request, reply) {
    models.Suggestion.findAll({ order: 'createdAt ASC' })
      .then(function(suggestions) {
        reply(suggestions).code(200);
      });
  },
  create: function (request, reply) {
    models.Suggestion.create(request.payload)
      .then(function (result) {
        models.Event.create({
          type: 'suggestions:created',
          body: JSON.stringify(result)
        }).then(function (result) {
          request.server.app.io.sockets.emit(result.type, JSON.parse(result.body));
          reply('Created.').code(200);
        });
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
  }
};