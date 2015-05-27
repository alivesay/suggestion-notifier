'use strict';

var Boom = require('boom');

var models = require('../../db/models');

module.exports = {
  all: function (request, reply) {
    models.Template.findAll()
      .then(function(templates) {
        reply(templates).code(200);
      });
  },
  create: function (request, reply) {
    models.Template.create(request.payload)
      .then(function () {
        reply('Created.').code(200);
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
  }
};