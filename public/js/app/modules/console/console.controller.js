(function(){
  'use strict';

  angular.module('app.console')
    .controller('ConsoleIndexController', ConsoleIndexController);

  ConsoleIndexController.$inject = ['$scope', '$state', '$timeout',
                                    'socket', 'EventFactory'];

  function ConsoleIndexController($scope, $state, $timeout,
                                  socket, EventFactory) {

    $scope.$state = $state;
    $scope.messages = [];
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
      }
    };

    onLoad();

    function onLoad() {

      $scope.$on('ui-message-list:loaded', function () {
        fetchEvents();
      });

      angular.forEach($scope.consoleEvents, function listenAndPushEvent (value, key) {
        if (value.disableListener !== true) {
          socket.on(key, function consoleEventCallback(body) {
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
        source: event.body.source || 'SYSTEM',
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

    function minimizeClick() {
      $scope.$emit('console:minimized', $state.current.name)
    }

    function closeClick() {
      $scope.$emit('console:closed', $state.current.name)
    }
  }

})();