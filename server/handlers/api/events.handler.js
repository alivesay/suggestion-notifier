'use strict';

var Boom = require('boom');

var controllers = require('../../controllers');

module.exports = {

  all: function (request, reply) {
    controllers.EventsController.getEvents({
      queryOptions: {
        limit: request.query.limit,
        order: 'updatedAt DESC'
      }
    }, getEventsDone);

    function getEventsDone (err, result) {
      if (err) {
        return reply(Boom.badRequest(err));
      }

      return reply(result).code(200);
    }
  }
};