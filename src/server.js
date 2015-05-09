'use strict';

var Hapi = require('hapi');
var merge = require('lodash-node/modern/objects/merge');
var path = require('path');
var requireDirectory = require('require-directory');

var settings = require('./server/config/settings');
var methods = require('./server/config/methods')(settings);

var server = new Hapi.Server();

server.connection(merge({
    host: settings.host || process.env.IP || '0.0.0.0',
    port: settings.port || process.env.PORT || '8080'
  }, settings.hapi.options
));

var handlers = requireDirectory(module, path.join(__dirname, 'server/handlers'));
var routes = require('./server/config/routes')(handlers);

server.route(routes);
server.method(methods);

server.start(function () {
  console.log('Server listening: %s', server.info.uri);
});