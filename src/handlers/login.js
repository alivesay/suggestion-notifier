'use strict';

module.exports = {
  GET: function (request, reply) {
    return reply.view('index', {
      title: 'examples/views/jade/index.js | Hapi ',
      message: 'Index - Hello World!'
    });
  }
};