'use strict';

var async = require('async');
var Boom = require('boom');
var models = require('../../db/models');
var ilsapi = require('../../lib/ilsapi');

module.exports = {
  create: function (request, reply) {
    // TODO: here we lookup the patron info
    // then lookup the bib record
    // then compile message body template
    // then send email

    async.waterfall([
      function (callback) {
        ilsapi.getPatron(0, callback);
      },
      function (patron, callback) {

        var mailOptions = {
          to: 'andrewl@multco.us', // TODO: comes from patronapi
          from: request.server.settings.app.notices.fromAddress,
          subject: 'Purchase Suggestion Update: ' + patron.patronName,
          text: request.payload.template.body // TODO: templatizing
        };

        request.server.app.transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return callback(err, null);
          }

          models.Suggestion
            .findById(request.payload.suggestionId)
            .then(function (suggestion) {
              suggestion
                .destroy()
                .then(function () {
                  models.Event
                    .create({
                      type: 'notices:sent',
                      body: JSON.stringify({})
                    })
                    .then(function (event) {
                      request.server.app.io.sockets.emit(event.type, JSON.parse(event.body));
                      return callback(null, null);
                    });
                })
            })
            .catch(function (err) {
              return callback(err, null);
            });
        });



      }
    ], function(err, result) {
      if (err) {
        return reply(Boom.badRequest(err));
      }

      return reply('Sent.').code(200);

    });

    // TODO: log
    /*
    models.Event.create(request.payload)
      .then(function (result) {
        reply('Created.').code(200);
      })
      .catch(function (err) {
        reply(Boom.badRequest(err));
      });
    */
  }
};