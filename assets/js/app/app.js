'use strict';

angular.module('app', [
  'ngResource',
  'ngAnimate',
  'ui.router',
  'angular-loading-bar',
  'ui.bootstrap',
  'toastr',
  'suggestions',
  'console'
]);

angular.module('app').config(['$stateProvider', '$urlRouterProvider', 'toastrConfig', function($stateProvider, $urlRouterProvider, toastrConfig) {
  $urlRouterProvider.otherwise('/suggestions');

  angular.extend(toastrConfig, {
    closeButton: true,
    progressBar: true
  });
}]);

angular.module('app').controller('AppController', ['$scope', 'toastr', function ($scope, toastr) {
  $scope.settingsClick = function () {
    toastr.error('Not implemented yet.');
  };

  $scope.logoutClick = function () {
    toastr.error('Not implemented yet.');
  };
}]);

angular.module('app').factory('socket', ['$rootScope', 'toastr', function ($rootScope, toastr) {
  // DEBUG: localStorage.debug = '*';

  var socket = io.connect();

  socket.on('connect', function () {
    console.log('socket.io connected.');
    toastr.success('socket.io connected.');
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
}]);