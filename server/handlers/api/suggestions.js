'use strict';

var Boom = require('boom');

var models = require('../../db/models');
var controllers = require('../../controllers');

// TODO:

models.Suggestion.hook('afterCreate', function (suggestion, options) {
  controllers.EventsController.log({
    type: 'suggestions:created',
    body: suggestion,
    logFields: [
      'title'
    ]
  })
});

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
        reply('Created.').code(200);
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
  }
};