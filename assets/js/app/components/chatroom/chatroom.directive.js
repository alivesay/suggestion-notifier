(function(){
  'use strict';

  angular.module('ui.chatroom', [
    'app.config',
    'ui.message-list'
  ]);

  angular.module('ui.chatroom')
    .directive('uiChatroom', uiChatroom);

  uiChatroom.$inject = ['APP_CONFIG'];

  function uiChatroom(APP_CONFIG) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        messages: '=',
        username: '='
      },
      controller: UiChatroomController,
      templateUrl: APP_CONFIG.COMPONENT_PATH + 'chatroom/chatroom.html'
    };
  }

  UiChatroomController.$inject = ['$scope', 'socket'];

  function UiChatroomController ($scope, socket) {
    $scope.messages = [];

    socket.on('init', function (data) {
      $scope.name = data.name;
      $scope.users = data.users;
    });

    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });

    socket.on('send:message', function (message) {
      $scope.messages.push(message);
    });

    socket.on('user:join', function (data) {
      $scope.messages.push({
        source: 'chatroom',
        text: 'User ' + data.name + ' has joined.',
        timestamp: Date.now()
      });
      $scope.users.push(data.name);
    });

    socket.on('user:left', function (data) {
      $scope.messages.push({
        source: 'chatroom',
        text: 'User ' + data.name + ' has left.',
        timestamp: Date.now()
      });
      $scope.users.remove(function (el) {
        return el === data.name;
      });
    });

    $scope.sendMessage = function sendMessage () {
      socket.emit('send:message', {
        message: $scope.message
      });

      $scope.messages.push({
        source: $scope.name,
        text: $scope.message,
        timestamp: Date.now()
      });

      $scope.message = '';
    };

    $scope.getMessageClasses = function getMessageClasses (message) {
      var isDirectedMessage = message.source !== $scope.username &&
          message.text.match(new RegExp($scope.username, 'i'));

      return {
        'chatroom-message-list-alert': message.source === 'chatroom',
        'chatroom-message-list-directed': isDirectedMessage
      };
    };
  }

})();