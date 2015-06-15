(function() {
  'use strict';

  angular.module('app.shared', [
    'ngResource',
    'toastr'
  ]);

  angular.module('app', [
    'ngResource',
    'ngAnimate',
    'ngDialog',
    'ui.router',
    'angular-loading-bar',
    'app.shared',
    'app.console',
    'app.suggestions',
    'app.settings'
  ]);

  angular.module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['$scope', '$state', 'toastr', 'ngDialog',
                           'APP_CONFIG'];

  function AppController($scope, $state, toastr, ngDialog,
                         APP_CONFIG) {

    $scope.$state = $state;
    $scope.MODULE_PATH = APP_CONFIG.MODULE_PATH;
    $scope.footerCollapsed = false;
    $scope.settingsClick = settingsClick;
    $scope.logoutClick = logoutClick;
    $scope.consoleClick = consoleClick;

    onLoad();

    function onLoad() {
      $scope.$on('console:closed', function (stateName) {
        $scope.footerCollapsed = true;
      });

      $scope.$on('console:minimized', function (stateName) {
        $scope.footerCollapsed = false;
      });
    }

    function settingsClick() {
      ngDialog.open({
        template: APP_CONFIG.MODULE_PATH + 'settings/settings.index.html',
        className: 'ngdialog-theme-default',
        scope: $scope
      });
    }

    function logoutClick() {
      toastr.error('Not implemented yet.');
    }

    function consoleClick() {
      $scope.footerCollapsed = false;
    }
  }

  angular.module('app').factory('socket', SocketFactory);

  SocketFactory.$inject = ['$rootScope', 'toastr'];

  function SocketFactory($rootScope, toastr) {
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
  }

})();