'use strict';

module.exports = function (handlers) {
    return [
    {
      method: 'GET',
      path: '/{path*}',
      handler: {
        directory: {
          path: __dirname + '/../../.tmp/public'
        }
      }
    },
    {
      method: 'GET',
      path: '/api/suggestions',
      config: {
        handler: handlers.api.suggestions.all
      }
    },
    {
      method: 'POST',
      path: '/api/suggestions',
      config: {
        handler: handlers.api.suggestions.create,
        validate: {
        }
      }
    },
    {
      method: 'GET',
      path: '/api/itemtypes',
      config: {
        handler: handlers.api.itemtypes.all,
        validate: {
        }
      }
    }
  ];
};