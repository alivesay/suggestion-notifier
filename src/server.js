'use strict';

var Hapi = require('hapi');
var _ = require('lodash');
var path = require('path');
var requireDirectory = require('require-directory');

var settings = require('./config/settings');
var methods = require('./config/methods')(settings);
var models = require('./db/models');

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
/*
  server.views(_.defaults(settings.hapi.views || {}, {
    engines: { jade: require('jade') },
    relativeTo:  __dirname,
    path: './views',
    compileOptions: {
      pretty: !!(process.env.NODE_ENV !== 'production')
    }
  }));
*/
  var handlers = requireDirectory(module, path.join(__dirname, 'handlers'));
  var routes = require('./config/routes')(handlers);
  
  server.route(routes);
  server.method(methods);
  
  server.start(function () {
    console.log('Server listening: %s', server.info.uri);
  });
};