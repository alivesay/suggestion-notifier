var Mentat = require('mentat');

Mentat.start();

// redirect all 404s to '/' for angular's html5Mode(true)
Mentat.server.ext('onPreResponse', function (request, reply) {
    if (request.response.isBoom && request.response.message === 'Not Found') {
        return reply.redirect('/');
    }

    return reply.continue();
});
