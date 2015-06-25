'use strict';

var Mentat = require('mentat');

Mentat.models.Suggestion.hook('afterCreate', function (suggestion, options) {
  Mentat.controllers.EventsController.log({
      type: 'suggestions:created',
      body: suggestion
    }, {
      logFields: [ 'title' ]
  });
});

function getSuggestions(options, callback) {
  Mentat.models.Suggestion
    .findAll(options)
    .nodeify(callback);
}

function createSuggestion(suggestion, options, callback) {
  Mentat.models.Suggestion
    .create(suggestion, options)
    .nodeify(callback);
}

module.exports = new Mentat.Controller('Suggestions', {
  getSuggestions: getSuggestions,
  createSuggestion: createSuggestion
});