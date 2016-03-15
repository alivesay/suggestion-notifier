'use strict';

var _ = require('lodash');
var async = require('async');
var Mentat = require('mentat');

function log (options) {
  var self = this;

  var eventBody = options.logFields
    ? _.pick(options.event.body, options.logFields)
    : options.event.body;

  eventBody.generatedBy = Mentat.Namespace.get('username');
  
  function _logEvent(_callback) {
    return self.createEvent({
      event: {
        type: options.event.type,
        body: eventBody
      }
    }, _callback);
  }

  function _emitEvent(result, _callback) {
    var socketBody = options.event.body;
    socketBody.generatedBy = Mentat.Namespace.get('username');
    Mentat.io.sockets.emit(options.event.type, socketBody);
    return _callback(null, null);
  }

  function _logDone(err, response, callback) {
    if (err) {
      console.error('Error: ' + err);
    }
  }

  async.waterfall([ _logEvent, _emitEvent ], _logDone);
}

function getEvents(options, callback) {
  Mentat.models.Event
    .findAll(options.queryOptions)
    .nodeify(callback);
}

function createEvent(options, callback) {
  Mentat.models.Event
    .create({
      type: options.event.type,
      body: JSON.stringify(options.event.body),
      username: Mentat.Namespace.get('username') || null
    }, options.queryOptions)
    .nodeify(callback);
}

module.exports = new Mentat.Controller('Events', {
  log: log,
  getEvents: getEvents,
  createEvent: createEvent
});
