'use strict';

var Mentat = require('mentat');

module.exports = new Mentat.Handler('Suggestions', {
  routes: [
    { method: 'GET', path: '/api/suggestions' },
    { method: 'POST', path: '/api/suggestions' }
  ],

  GET: function (request, reply) {
    return Mentat.controllers.SuggestionsController.getSuggestions({
      queryOptions: {
        order: 'createdAt ASC'
      }
    }, Mentat.Handler.buildDefaultResponder(reply));
  },

  POST: function (request, reply) {
    return Mentat.controllers.SuggestionsController.createSuggestion(
      request.payload,
      Mentat.Handler.buildDefaultResponder(reply)
    );
  }
});