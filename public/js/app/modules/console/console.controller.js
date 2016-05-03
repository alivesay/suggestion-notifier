(function(){
  'use strict';

  angular.module('app.console')
    .controller('ConsoleIndexController', ConsoleIndexController);

  ConsoleIndexController.$inject = ['$scope', '$state', '$timeout',
                                    'socket', 'EventFactory'];

  function ConsoleIndexController($scope, $state, $timeout,
                                  socket, EventFactory) {

    $scope.messages = [];
    $scope.maximizeClick = maximizeClick;
    $scope.minimizeClick = minimizeClick;
    $scope.closeClick = closeClick;

    $scope.consoleEvents = {
      'suggestions:created': {
        toString: function (event) {
          return 'New suggestion: ' + event.body.title;
        }
      },
      'suggestions:deleted': {
        toString: function (event) {
          return 'Suggestion removed: ' + event.body.title;
        }
      },
      'suggestions:updated': {
        toString: function (event) {
          return 'Suggestion updated: ' + event.body.title;
        }
      },
      'templates:created': {
        toString: function (event) {
          return 'New template: ' + event.body.title;
        }
      },
      'templates:deleted': {
        toString: function (event) {
          return 'Template deleted: ' + event.body.title;
        }
      },
      'templates:updated': {
        toString: function (event) {
          return 'Template updated: ' + event.body.title;
        }
      },
      'notices:sent': {
        toString: function (event) {
          return 'Notice sent: ' + event.body.title;
        }
      },
      'chatroom:send:message': {
        toString: function (event) {
          return event.body.text;
        },
        disableListener: true
      },
      'users:updated': {
        toString: function (event) {
            return "User settings changed for '" + event.body.username + 
                "': [ isAdmin: " + event.body.isAdmin + ' isAuthorized: ' +
                event.body.isAuthorized + ' ]';
        }
      },
      'users:created': {
        toString: function (event) {
            return "User created: " + event.body.username;
        }
      }

    };

    onLoad();

    function onLoad() {

      $scope.$on('ui-message-list:loaded', function () {
        fetchEvents();
      });

      angular.forEach($scope.consoleEvents, function listenAndPushEvent (value, key) {
        if (value.disableListener !== true) {
          socket.forward(key, $scope);
          $scope.$on('socket:' + key, function consoleEventCallback(ev, body) {
            displayEventMessage({type: key, body: body}, refreshMessageList);
          });
        }
      });
    }

    function refreshMessageList() {
      $timeout(function () {
        $scope.$broadcast('ui-message-list:update');
      });
    }

    function displayEventMessage(event, callback) {
      var message = {
        source: event.body.source || event.body.generatedBy || 'SYSTEM',
        text: $scope.consoleEvents[event.type]
          ? $scope.consoleEvents[event.type].toString(event)
          : '[' + event.type + '] ' + JSON.stringify(event.body),
        timestamp: event.createdAt || Date.now()
      };

      $scope.messages.push(message);

      if (callback) {
        callback();
      }
    }

    function fetchEvents() {
      $scope.messages = [];

      EventFactory.query({ limit: 20 }, function (events) {
        while(events.length > 0) {
          var event = events.pop();
          event.body = JSON.parse(event.body);
          displayEventMessage(event);
        }
        refreshMessageList();
      });
    }

    function maximizeClick() {
      $state.go('console#index');
    }

    function minimizeClick() {
      $state.go('suggestions#index');
      $scope.$emit('console:minimized', $state.current.name)
    }

    function closeClick() {
      $state.go('suggestions#index');
      $scope.$emit('console:closed', $state.current.name)
    }
  }

})();
