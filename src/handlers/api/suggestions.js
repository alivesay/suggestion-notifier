'use strict';

var Boom = require('boom');

var models = require('../../db/models');

module.exports = {
  all: function (request, reply) {
    models.Suggestion.findAll({ order: 'updatedAt DESC' })
      .then(function(suggestions) {
        reply(suggestions).code(200);
      });
  },
  create: function (request, reply) {
    models.Suggestion.create(request.payload)
      .then(function () {
        reply('Created.').code(200);
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
  }
};