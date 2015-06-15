'use strict';

var Boom = require('boom');

var models = require('../../db/models');

module.exports = {
  all: function (request, reply) {
    models.Event.findAll({
      limit: request.query.limit,
      order: 'updatedAt DESC'
    })
    .then(function(events) {
      reply(events).code(200);
    });
  },
  create: function (request, reply) {
    models.Event.create(request.payload)
      .then(function (result) {
        reply('Created.').code(200);
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
  }
};