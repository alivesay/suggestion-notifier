'use strict';

module.exports = function (handlers) {
  return [
    {
      method: 'GET', path: '/{path*}',
      handler: {
        directory: {
          path: __dirname + '/../../.tmp/public'
        }
      }
    },
    {
      method: 'GET', path: '/api/suggestions',
      config: {
        handler: handlers.api.suggestions.all
      }
    },
    {
      method: 'POST', path: '/api/suggestions',
      config: {
        handler: handlers.api.suggestions.create,
        validate: {}
      }
    },
    {
      method: 'GET', path: '/api/templates',
      config: {
        handler: handlers.api.templates.all
      }
    },
    {
      method: 'GET', path: '/api/templates/{id}',
      config: {
        handler: handlers.api.templates.one
      }
    },
    {
      method: 'POST', path: '/api/templates',
      config: {
        handler: handlers.api.templates.create,
        validate: {}
      }
    },
    {
      method: 'POST', path: '/api/templates/{id}',
      config: {
        handler: handlers.api.templates.update
      }
    },
    {
      method: 'DELETE', path: '/api/templates/{id}',
      config: {
        handler: handlers.api.templates.destroy,
        validate: {}
      }
    },
    {
      method: 'GET', path: '/api/events',
      config: {
        handler: handlers.api.events.all
      }
    },
    {
      method: 'GET', path: '/api/itemtypes',
      config: {
        handler: handlers.api.itemtypes.all,
        validate: {}
      }
    },
    {
      method: 'POST', path: '/api/notices',
      config: {
        handler: handlers.api.notices.create,
        validate: {}
      }
    }
  ];
};