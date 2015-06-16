'use strict';

var Hapi = require('hapi');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var requireDirectory = require('require-directory');
var nodemailer = require('nodemailer');

var settings = require('./config/settings');
var methods = require('./config/methods');
var models = require('./db/models');


function loadSocketIO(server) {
  server.app.io = require('socket.io')(server.listener);
  server.app.io.on('connection', function (socket) {
    console.log('socket.io: connected');
    fs.readdirSync(path.join(__dirname, 'sockets')).forEach(function (file) {
      require('./sockets/' + file)(socket);
      console.log('socket.io: loaded module: ' + file.split('.')[0]);
    });
  });
}

module.exports.start = function start () {
  var server = new Hapi.Server(_.defaults(settings.hapi.serverOptions || {},
    process.env.NODE_ENV !== 'production' ? { debug: {
      request: ['error'],
      log: ['error']
    }} : {}));
  
  server.connection(_.defaults(settings.hapi.connectionOptions || {}, {
    host: process.env.IP || '0.0.0.0',
    port: process.env.PORT || '8080'
  }));

  server.app.transporter = nodemailer.createTransport(settings.nodemailerOptions);

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
    loadSocketIO(server);
    console.log('Server listening: %s', server.info.uri);
  });
};