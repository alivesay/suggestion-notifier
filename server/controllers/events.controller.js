'use strict';

var _ = require('lodash');
var async = require('async');

var server = require('..').server;
var models = require('../db/models');

var EventsController = {
  name: 'EventsController',

  log: function log (options) {
    var self = this;

    async.waterfall([
      function logEvent (callback) {
        return self.createEvent({
          type: options.type,
          body: options.logFields
            ? _.pick(options.body, options.logFields)
            : options.body
        }, callback);
      },
      function emitEvent (result, callback) {
        server.app.io.sockets.emit(options.type, options.body);
        return callback(null, null);
      }
    ], function logDone (err, result) {
      if (err) {
        console.error('Error: ' + err);
      }
    });
  },

  getEvents: function getEvents (options, callback) {
    models.Event
      .findAll(_.defaults(options.queryOptions || {}, {}))
      .then(function (result) {
        if (callback) {
          return callback(null, result);
        }
      })
      .catch(function (err) {
        if (callback) {
          return callback(err, null);
        }
      });
  },

  createEvent: function createEvent (options, callback) {
    models.Event
      .create(_.defaults({
        type: options.type,
        body: JSON.stringify(options.body)
      }))
      .then(function (result) {
        //request.server.app.io.sockets.emit(result.type, JSON.parse(result.body));
        return callback(null, result);
      })
      .catch(function (err) {
        return callback(err, null);
      });
  }
};

module.exports = EventsController;