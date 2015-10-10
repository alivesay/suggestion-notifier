'use strict';

var Mentat = require('mentat');

module.exports = new Mentat.Handler('Suggestions', {
    routes: [
        { method: 'GET', path: '/api/suggestions/{id?}', handler: 'read' },
        { method: 'POST', path: '/api/suggestions/{id?}', handler: 'createOrUpdate' },
        { method: 'DELETE', path: '/api/suggestions/{id}', handler: 'delete' }
    ],

    read: function (request, reply) {
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

    createOrUpdate: function (request, reply) {
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
    },

    delete: function (request, reply) {
        return Mentat.controllers.SuggestionsController.destroySuggestion({
            id: request.params.id
        }, Mentat.Handler.buildDefaultResponder(reply));
    }
});
