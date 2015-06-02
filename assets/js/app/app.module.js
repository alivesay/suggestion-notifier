(function() {
  'use strict';

  angular.module('app', [
    'ngResource',
    'ngAnimate',
    'ui.router',
    'angular-loading-bar',
    'ui.bootstrap',
    'toastr',
    'app.console',
    'app.suggestions'
  ]);

  angular.module('app').config(appConfig);

  appConfig.$inject = ['$urlRouterProvider', 'toastrConfig'];

  function appConfig($urlRouterProvider, toastrConfig) {
    $urlRouterProvider.otherwise('/suggestions');

    angular.extend(toastrConfig, {
      closeButton: true,
      progressBar: true
    });
  }

  angular.module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['toastr'];

  function AppController(toastr) {
    var vm = this;

    vm.settingsClick = settingsClick;
    vm.loginClick = loginClick;

    function settingsClick() {
      toastr.error('Not implemented yet.');
    }

    function loginClick() {
      toastr.error('Not implemented yet.');
    }
  }

  angular.module('app').factory('socket', SocketFactory);

  SocketFactory.$inject = ['$rootScope', 'toastr'];

  function SocketFactory($rootScope, toastr) {
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
  }

})();