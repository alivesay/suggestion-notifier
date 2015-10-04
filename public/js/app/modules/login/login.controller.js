(function() {
  'use strict';

  angular.module('app.login')
    .controller('LoginIndexController', LoginIndexController);

  LoginIndexController.$inject = ['$scope', 'APP_CONFIG', '$location',
                                  '$window', 'AuthFactory', 'UserFactory',
                                  'toastr', 'socket'];

  function LoginIndexController($scope, APP_CONFIG, $location,
                                $window, AuthFactory, UserFactory,
                                toastr, socket) {
    $scope.MODULE_PATH = APP_CONFIG.MODULE_PATH;
    $scope.login = login;

    function login(username, password) {
      if (username !== undefined && password !== undefined) {

        UserFactory.login(username, password).then(
          function success (data) {
            AuthFactory.isLogged = true;
            $window.sessionStorage.token = data.token;

            socket.emit('authenticate', { token: data.token });

            toastr.success('Logged in!');
            $location.path("/suggestions");
          },
          function error (status, data) {
            if (status && status.data) {
                if (status.data.message === 'invalid user') {
                    $scope.login.username = '';
                }
                if (status.data.message === 'invalid password') {
                    $scope.login.password = '';
                }
            }
            toastr.error('Login failed!');
          }
        );
      }
    }
  }

})();
