'use strict';

var _ = require('lodash');
var async = require('async');
var Mentat = require('mentat');

function log (event, options) {
  var self = this;

  function _logEvent(_callback) {
    return self.createEvent({
      type: event.type,
      body: options.logFields
        ? _.pick(event.body, options.logFields)
        : event.body
    }, {}, _callback);
  }

  function _emitEvent(result, _callback) {
    Mentat.io.sockets.emit(event.type, event.body);
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
    .findAll(options)
    .nodeify(callback);
}

function createEvent(event, options, callback) {
  Mentat.models.Event
    .create({
      type: event.type,
      body: JSON.stringify(event.body)
    }, options)
    .nodeify(callback);
}

module.exports = new Mentat.Controller('Events', {
  log: log,
  getEvents: getEvents,
  createEvent: createEvent
});