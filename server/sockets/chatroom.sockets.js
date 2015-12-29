var Mentat = require('mentat');

var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  var getGuestName = function () {
    var name
      , nextUserId = 1;

    do {
      name = 'Guest' + nextUserId++;
    }  while (!claim(name));

    return name;
  };

  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

module.exports = function (socket) {
  var name = socket.decoded_token.username || userNames.getGuestName();

  socket.emit('chatroom:init', {
    name: name,
    users: userNames.get()
  });

  socket.broadcast.emit('chatroom:user:join', {
    name: name
  });

  socket.on('chatroom:send:message', function (data) {
    var message = {
      source: name,
      text: data.message,
      timestamp: Date.now()
    };

    Mentat.controllers.EventsController.log({
      event: {
        type: 'chatroom:send:message',
        body: message
      }
    }, {
      logFields: [ 'source', 'text' ]
    });

  });

  socket.on('chatroom:disconnect', function () {
    socket.broadcast.emit('chatroom:user:left', {
      name: name
    });
    userNames.free(name);
  });

};
