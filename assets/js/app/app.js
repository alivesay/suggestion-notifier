'use strict';

angular.module('app', [
  'ngResource',
  'ui.router',
  'angular-loading-bar',
  'ui.bootstrap',
  'suggestions',
  'console'
]);


angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/suggestions");
}]);


angular.module('app').factory('socket', function ($rootScope) {
  // DEBUG: localStorage.debug = '*';

  var socket = io.connect();

  socket.on('connect', function () {
    console.log('socket.io connected.');
  });

  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});