'use strict';

var _ = require('lodash');
var Mentat = require('mentat');

function get(options, callback) {
  Mentat.models.Config
    .findOne({ where: { key: options.key } })
    .nodeify(callback);
}

function set(options, callback) {
  Mentat.models.Config
    .update({ value: JSON.stringify(options.value) }, { fields: ['value'], where: { key: options.key} })
    .nodeify(callback);
}

module.exports = new Mentat.Controller('Configs', {
    get: get,
    set: set
});
