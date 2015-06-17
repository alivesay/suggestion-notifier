'use strict';

var Boom = require('boom');

var models = require('../../db/models');

module.exports = {
  all: function (request, reply) {
    models.Template.findAll()
      .then(function(templates) {
        reply(templates).code(200);
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
  },

  one: function (request, reply) {
    models.Template.findById(request.params.id)
      .then(function(template) {
        reply(template).code(200);
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
  },

  update: function (request, reply) {
    models.Template.upsert(request.payload)
      .then(function () {
        models.Event.create({
          type: 'templates:updated',
          body: JSON.stringify({ title: request.payload.title })
        }).then(function (event) {
          request.server.app.io.sockets.emit(event.type, JSON.parse(event.body));
          reply('Updated.').code(200);
        });
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
  },

  create: function (request, reply) {
    models.Template.create(request.payload)
      .then(function (template) {
        // TODO: gross
        models.Event.create({
          type: 'templates:created',
          body: JSON.stringify({ title: template.title })
        }).then(function (event) {
          request.server.app.io.sockets.emit(event.type, JSON.parse(event.body));
          reply('Created.').code(200);
        });
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
  },

  destroy: function (request, reply) {
    models.Template
      .findById(request.params.id)
      .then(function (template) {
        template
          .destroy()
          .then(function () {
            models.Event
              .create({
                type: 'templates:deleted',
                body: JSON.stringify({ title: template.title })
              })
              .then(function (event) {
                request.server.app.io.sockets.emit(event.type, JSON.parse(event.body));
                reply('Deleted.').code(200);
            });
          })
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
  }

};