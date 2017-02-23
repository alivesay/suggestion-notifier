'use strict';

var Mentat = require('mentat');
var redis = require('redis');
var client = redis.createClient();
var Boom = require('boom');

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
        // TODO: refactor
        let midnight = new Date();
        midnight.setHours(24 + 8, 0, 0, 0);

        if (request.params.id) {
            return Mentat.controllers.SuggestionsController.updateSuggestion({
                suggestion: request.payload
            },
            Mentat.Handler.buildDefaultResponder(reply));
        }
        
        if (request.payload.patron && request.payload.suggestionType === 'patron') {
            let key = 'patronlimit_' + request.payload.patron;
            client.incr(key, function (err, val) {

                if (err) {
                    return reply(Boom.badImplementation('redis broke', err));
                }

                client.expireat(key, midnight.valueOf() / 1000);

               if (val > 5) {
                   return reply(Boom.create(402, 'limit reached'));
               }

                return Mentat.controllers.SuggestionsController.createSuggestion({
                        suggestion: request.payload
                    },
                    Mentat.Handler.buildDefaultResponder(reply, {
                        notFoundOnNull: false
                    })
                );
            });
        } else {
            return Mentat.controllers.SuggestionsController.createSuggestion({
                    suggestion: request.payload
                },
                Mentat.Handler.buildDefaultResponder(reply, {
                    notFoundOnNull: false
                })
            );
        }

    },

    delete: function (request, reply) {
        return Mentat.controllers.SuggestionsController.destroySuggestion({
            id: request.params.id
        }, Mentat.Handler.buildDefaultResponder(reply));
    }
});
