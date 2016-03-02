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
                $scope.$broadcast('console:wasclosed');
            });

            $scope.$on('console:minimized', function () {
                $scope.footerCollapsed = false;
                $scope.$broadcast('console:wasminimized');
            });
        }

        function settingsClick() {
            ngDialog.open({
                template: APP_CONFIG.MODULE_PATH + 'settings/settings.index.html',
                scope: $scope
            });
        }

        function logoutClick() {
            if (AuthFactory.isAuthenticated) {
                UserFactory.logout()
                    .then(
                        function success () { },
                        function error (status) {
                            console.log('Error: ' + status.data.error + ': ' + status.data.message);
                        })
                    .finally(function () {
                        AuthFactory.isAuthenticated = false;
                        socket.isAuthenticated = false;
                        delete $window.sessionStorage.token;
                        socket.reconnect();
                        $state.go('login#index');
                    });
            }
        }

        function consoleClick() {
            $scope.footerCollapsed = false;
            $scope.$broadcast('console:wasopened');
        }
    }

    angular.module('app').service('socket', SocketFactory);

    SocketFactory.$inject = ['$rootScope', '$timeout', '$q', '$window', 'toastr'];

    function SocketFactory($rootScope, $timeout, $q, $window, toastr) {
        var self = this;

        self.queue = [];
        self.socket = undefined;
        self.isAuthenticated = false;

        function connectSocket() {
            try {
                self.socket = io.connect({ forceNew: false });
            } catch (e) {
                console.log('socket.io error: ' + e);
            }

            self.socket.on('connect', function () {
                console.log('socket.io connected.');
                tryAuth();
            });

            self.socket.on('authenticated', function () {
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
            });

            self.socket.on('error', function (error) {
                toastr.error('Socket error.  Try refreshing the page.');
                console.log(error);
            });

            self.socket.on('reconnect', function () {
                console.log('socket.io reconnected.');
            });

            self.socket.on('disconnect', function () {
                console.log('socket.io disconnected.');
                self.isAuthenticated = false;
            });
        }

        function tryAuth() {
            if ($window.sessionStorage.token) {
                self.socket.emit('authenticate', { token: $window.sessionStorage.token });
            }
        }

        function on(eventName, callback) {
            self.socket.on(eventName, function () {
                var args = arguments;
                $timeout(function () {
                    callback.apply(self.socket, args);
                }, 0);
            });
        }

        function emit(eventName, data, callback) {
            self.socket.emit(eventName, data, function () {
                var args = arguments;
                if (callback) {
                    $timeout(function () {
                        callback.apply(self.socket, args);
                    }, 0);
                }
            });
        }

        connectSocket();

        return {
            on: function (eventName, callback) {
                if (self.isAuthenticated) {
                    self.socket.on(eventName, callback);
                } else {
                    self.queue.push({ type: 'on', eventName: eventName, callback: callback });
                }
            },

            emit: function (eventName, data, callback) {
                if (self.isAuthenticated || eventName === 'authenticate') {
                    self.socket.emit(eventName, data, callback);
               } else {
                    self.queue.push({ type: 'emit', eventName: eventName, data: data, callback: callback });
                }
            },

            getSocket: function () {
                return self.socket;
            },

            reconnect: function () {
                self.socket.disconnect();
                connectSocket();
            }
        };
    }

})();
