'use strict';

var fs = require('fs');
var path = require('path');

var basename = path.basename(module.filename);
var controllers = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function (file) {
    var controller = require('./' + file);
    controllers[controller.name] = controller;
  });

module.exports = controllers;