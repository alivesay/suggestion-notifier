'use strict';

module.exports = function (handlers) {
  return [
  {
      method: 'GET',
      path: '/login',
      config: {
        handler: handlers.login.GET,
      }
    }
  ];
};