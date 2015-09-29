'use strict';

var Mentat = require('mentat');

Mentat.models.Suggestion.hook('afterCreate', function (suggestion) {
    Mentat.controllers.EventsController.log({
        event: {
            type: 'suggestions:created',
            body: suggestion
        },
        logFields: [ 'title' ]
    });
});

Mentat.models.Suggestion.hook('afterUpdate', function (suggestion) {
    Mentat.controllers.EventsController.log({
        event: {
            type: 'suggestions:updated',
            body: suggestion
        },
        logFields: [ 'title' ]
    });
});


Mentat.models.Suggestion.hook('afterDestroy', function (suggestion) {
    Mentat.controllers.EventsController.log({
        event: {
            type: 'suggestions:deleted',
            body: suggestion
        },
        logFields: [ 'title' ]
    });
});

function getSuggestions(options, callback) {
    Mentat.models.Suggestion
        .findAll(options.queryOptions)
        .nodeify(callback);
}

function getSuggestionById(options, callback) {
    Mentat.models.Suggestion
        .findById(options.id, options.queryOptions)
        .nodeify(callback);
}

function createSuggestion(options, callback) {
    Mentat.models.Suggestion
        .create(options.suggestion, options.queryOptions)
        .nodeify(callback);
}

function updateSuggestion(options, callback) {
    Mentat.models.Suggestion
        .findById(options.suggestion.id)
        .then(function (suggestion) {
            suggestion
            .update(options.suggestion, options.queryOptions)
            .nodeify(callback);
        })
    .catch(function (err) {
        return callback(err, null);
    });
}

module.exports = new Mentat.Controller('Suggestions', {
    getSuggestions: getSuggestions,
    getSuggestionById: getSuggestionById,
    createSuggestion: createSuggestion,
    updateSuggestion: updateSuggestion
});
