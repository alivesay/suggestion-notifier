'use strict';

angular.module('console', [
  'ui.chatroom'
]);

angular.module('console')
  .controller('ConsoleIndexController', [ '$scope', 'socket', function ($scope, socket) {

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

    $scope.sendMessage = function () {
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
  }]);
