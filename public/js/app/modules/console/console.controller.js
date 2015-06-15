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

    $scope.listenEvents = {
      'suggestions:created': {
        toString: function (event) {
          return 'New suggestion: ' + event.body.title;
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
      }
    };

    onLoad();

    function onLoad() {

      $scope.$on('ui-message-list:loaded', function () {
        fetchEvents();
      });

      angular.forEach($scope.listenEvents, function listenAndPushEvent (value, key) {
        socket.on(key, function consoleSocketCallback (body) {
          displayEventMessage({type: key, body: body}, refreshMessageList);
        });
      });
    }

    function refreshMessageList() {
      $timeout(function () {
        $scope.$broadcast('ui-message-list:update');
      });
    }

    function displayEventMessage(event, callback) {
      var message = {
        source: event.username || 'SYSTEM',
        text: $scope.listenEvents[event.type]
          ? $scope.listenEvents[event.type].toString(event)
          : '[' + event.type + '] ' + JSON.stringify(event.body),
        timestamp: event.createdAt
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