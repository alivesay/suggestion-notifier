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

    AppController.$inject = ['$scope', '$state', '$window', '$location', 'toastr', 'socket',
                             'ngDialog', 'AuthFactory', 'UserFactory', 'APP_CONFIG'];

    function AppController($scope, $state, $window, $location, toastr, socket,
                           ngDialog, AuthFactory, UserFactory, APP_CONFIG) {

        $scope.$state = $state;
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
                        socket.disconnect();
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

    SocketFactory.$inject = ['$rootScope', '$window', 'toastr'];

    function SocketFactory($rootScope, $window, toastr) {
        var self = this;

        self.socket = getSocket();
        self.isAuthenticated = false;

        function getSocket() {
            if (self.socket) {
                return self.socket;
            }

            var socket = io.connect('/', { forceNew: true });

            socket.on('connect', function () {
                console.log('socket.io connected.');
                getSocket() 
                    .on('authenticated', function () {
                        console.log('socket.io authenticated.');
                        self.isAuthenticated = true;
                    })
                    .on('error', function (error) {
                        console.log(error);
                    })
                    .on('disconnect', function () {
                        console.log('socket.io disconnected.');
                        self.isAuthenticated = false;
                        self.socket = undefined;
                        self.socket = getSocket();
                    });

                if ($window.sessionStorage.token) {
                    socket.emit('authenticate', { token: $window.sessionStorage.token });
                }
            });
               
            return socket;        
        }

        return {
            on: function (eventName, callback) {
                getSocket().on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(getSocket(), args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                if (!self.isAuthenticated && eventName !== 'authenticate') {
                    console.log('socket emitted before auth: ' + eventName);
                    return;
                }

                getSocket().emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(getSocket(), args);
                        }
                    });
                });
            },
            disconnect: function () {
                if (self.socket) {
                    self.socket.disconnect();
                }
            }
        };
    }

})();
