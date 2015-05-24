'use strict';

var Hapi = require('hapi');
var _ = require('lodash');
var path = require('path');
var requireDirectory = require('require-directory');

var settings = require('./config/settings');
var methods = require('./config/methods')(settings);
var models = require('./db/models');
var socket = require('./lib/socket');

module.exports.start = function start () {
  var server = new Hapi.Server(process.env.NODE_ENV !== 'production' ? {
    debug: {
      request: ['error'],
      log: ['error']
    }} : {});
  
  server.connection(_.defaults(settings.hapi.connection || {}, {
    host: process.env.IP || '0.0.0.0',
    port: process.env.PORT || '8080'
  }));

  // socket.io
  server.app.io = require('socket.io')(server.listener);
  server.app.io.on('connection', socket);

  if (process.env.NODE_ENV != 'production') {
    server.on('response', function (request) {
      console.log("[%s] %s %s - %s",
        request.info.remoteAddress,
        request.method.toUpperCase(),
        request.url.path,
        request.response.statusCode);
    });
  }

  var handlers = requireDirectory(module, path.join(__dirname, 'handlers'));
  var routes = require('./config/routes')(handlers);
  
  server.route(routes);
  server.method(methods);
  
  server.start(function () {
    console.log('Server listening: %s', server.info.uri);
  });
};