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
        messages: '='
        //username: '='
      },
      controller: UiChatroomController,
      templateUrl: APP_CONFIG.DIRECTIVE_PATH + 'chatroom/chatroom.html'
    };
  }

  UiChatroomController.$inject = ['$scope', 'socket'];

  function UiChatroomController ($scope, socket) {
    $scope.messages = [];
    $scope.users = [];

    socket.on('chatroom:init', function (data) {
      $scope.name = data.name;
      $scope.users = data.users || $scope.users;
    });

    socket.on('chatroom:send:name', function (data) {
      $scope.name = data.name;
      updateMessages();
    });

    socket.on('chatroom:send:message', function (message) {
      $scope.$apply(function () {
          $scope.messages.push(message);
          updateMessages();
      });
    });

    socket.on('chatroom:user:join', function (data) {
      $scope.messages.push({
        source: 'chatroom',
        text: 'User ' + data.name + ' has joined.',
        timestamp: Date.now()
      });
      $scope.users.push(data.name);
      updateMessages();
    });

    socket.on('chatroom:user:left', function (data) {
      $scope.messages.push({
        source: 'chatroom',
        text: 'User ' + data.name + ' has left.',
        timestamp: Date.now()
      });

      $scope.users.splice($scope.users.indexOf(data.name), 1);

      updateMessages();
    });

    $scope.sendMessage = function sendMessage (isFormValid) {
      if (isFormValid) {
        socket.emit('chatroom:send:message', {
          message: $scope.message
        });

        $scope.message = '';
      }
    };

    $scope.getMessageClasses = function getMessageClasses (message) {
      message.text = message.text || '';

      var isDirectedMessage = !!$scope.name && message.source !== $scope.name &&
          message.text.match(new RegExp($scope.name, 'i'));

      return {
        'chatroom-message-list-alert': message.source === 'chatroom',
        'chatroom-message-list-directed': isDirectedMessage
      };
    };

    function updateMessages() {
      $scope.$broadcast('ui-message-list:update');
    }
  }

})();
