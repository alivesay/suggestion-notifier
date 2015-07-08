'use strict';

var Mentat = require('mentat');

module.exports = new Mentat.Handler('Suggestions', {
  routes: [
    { method: 'GET', path: '/api/suggestions/{id?}' },
    { method: 'POST', path: '/api/suggestions/{id?}' }
  ],

  GET: function (request, reply) {
    if (request.params.id) {
      return Mentat.controllers.SuggestionsController.getSuggestionById({
        id: request.params.id
      }, Mentat.Handler.buildDefaultResponder(reply));
    }

    return Mentat.controllers.SuggestionsController.getSuggestions({
      queryOptions: {
        order: 'createdAt ASC'
      }
    }, Mentat.Handler.buildDefaultResponder(reply));
  },

  POST: function (request, reply) {
    if (request.params.id) {
      return Mentat.controllers.SuggestionsController.updateSuggestion({
        suggestion: request.payload
      },
      Mentat.Handler.buildDefaultResponder(reply));
    }

    return Mentat.controllers.SuggestionsController.createSuggestion({
        suggestion: request.payload
      },
      Mentat.Handler.buildDefaultResponder(reply, {
        notFoundOnNull: false
      })
    );
  }
});