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
    }
  ];
};