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

    SocketFactory.$inject = ['$rootScope', '$q', '$window', 'toastr'];

    function SocketFactory($rootScope, $q, $window, toastr) {
        var self = this;

        self.queue = [];
        self.socket = undefined;
        self.isAuthenticated = false;

        function connectSocket() {
            try {
                self.socket = io.connect({ forceNew: true });
            } catch (e) {
                console.log('socket.io error: ' + e);
            }

            self.socket.on('connect', function () {
                console.log('socket.io connected.');
                self.socket
                    .on('authenticated', function () {
                        console.log('socket.io authenticated.');
                        self.isAuthenticated = true;
                        self.queue.forEach(function (event) {
                            switch (event.type) {
                                case 'on':
                                    on(event.eventName, event.callback);
                                    break;
                                case 'emit':
                                    emit(event.eventName, event.data, event.callback);
                                    break;
                            }
                        });
                    })
                    .on('error', function (error) {
                        console.log(error);
                    })
                    .on('reconnect', function () {
                        console.log('socket.io reconnected.');
                    })
                    .on('disconnect', function () {
                        console.log('socket.io disconnected.');
                        self.isAuthenticated = false;
                        self.socket.connect();
                    });

                if ($window.sessionStorage.token) {
                    self.socket.emit('authenticate', { token: $window.sessionStorage.token });
                }
            });
        }

        function on(eventName, callback) {
            self.socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(self.socket, args);
                });
            });
        }

        function emit(eventName, data, callback) {
            self.socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(self.socket, args);
                    }
                });
            });
        }

        connectSocket();

        return {
            on: function (eventName, callback) {
                if (self.isAuthenticated) {
                    on(eventName, callback);
                } else {
                    self.queue.push({ type: 'on', eventName: eventName, callback: callback });
                }
            },

            emit: function (eventName, data, callback) {
                if (self.isAuthenticated || eventName === 'authenticate') {
                    emit(eventName, data, callback);
               } else {
                    self.queue.push({ type: 'emit', eventName: eventName, data: data, callback: callback });
                }
            },

            disconnect: function () {
                if (self.socket) {
                    self.socket.disconnect();
                }
            }
        };
    }

})();
