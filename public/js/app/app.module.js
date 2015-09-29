(function() {
    'use strict';
    /* global angular toastr io */

    angular.module('app.shared', [
        'ngResource',
        'toastr',
        'ui.bootstrap',
        'angular-loading-bar',
        'ngResource',
        'ngAnimate',
        'ngDialog',
        'ui.router'
    ]);

    angular.module('app', [
        'app.shared',
        'app.console',
        'app.suggestions',
        'app.settings',
        'app.login'
    ]);

    angular.module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$state', '$window', '$location', 'toastr',
                             'ngDialog', 'AuthFactory', 'UserFactory', 'APP_CONFIG'];

    function AppController($scope, $state, $window, $location, toastr,
                           ngDialog, AuthFactory, UserFactory, APP_CONFIG) {

        $scope.$stAe = $state;
        $scope.MODULE_PATH = APP_CONFIG.MODULE_PATH;
        $scope.footerCollapsed = true;
        $scope.settingsClick = settingsClick;
        $scope.logoutClick = logoutClick;
        $scope.consoleClick = consoleClick;
        $scope.auth = AuthFactory;
        $scope.uiRouterState = $state;

        onLoad();

        function onLoad() {
            $scope.$on('console:closed', function () {
                $scope.footerCollapsed = true;
            });

            $scope.$on('console:minimized', function () {
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
            if (AuthFactory.isLogged) {
                UserFactory.logout().then(
                    function success () {
                        AuthFactory.isLogged = false;
                        delete $window.sessionStorage.token;
                        $location.path('/');
                    },
                    function error (status) {
                        console.log(status);
                        console.log(error);
                    }
                );
            }
        }

        function consoleClick() {
            $scope.footerCollapsed = false;
        }
    }

    angular.module('app').factory('socket', SocketFactory);

    SocketFactory.$inject = ['$rootScope', 'toastr'];

    function SocketFactory($rootScope, toastr) {
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
                });
            }
        };
    }

})();
