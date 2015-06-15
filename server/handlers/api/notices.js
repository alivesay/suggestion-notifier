'use strict';

var Boom = require('boom');

var models = require('../../db/models');

module.exports = {
  create: function (request, reply) {
    // TODO: here we lookup the patron info
    // then lookup the bib record
    // then compile message body template
    // then send email

    var mailOptions = {
      to: 'andrewl@multco.us',
      from: 'andrew.livesay@gmail.com',
      subject: 'Purchase Suggestion Update',
      text: request.payload.template.body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return reply(Boom.badRequest(error));
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
                  reply('Sent.').code(200);
                });
            })
        })
        .catch(function (err) {
          reply(Boom.badRequest(err));
        });
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