'use strict';

module.exports = function (handlers) {
  return [
  {
      method: 'GET',
      path: '/bridges',
      config: {
        handler: handlers.login.GET,
      }
    }
  ];
};