(function() {
  'use strict';

  angular.module('app.users')
    .controller('UsersIndexController', UsersIndexController);

  UsersIndexController.$inject = ['$scope', 'APP_CONFIG', 'UsersFactory',
                                  'socket', 'toastr'];

  function UsersIndexController($scope, APP_CONFIG, UsersFactory,
                                socket, toastr) {
    $scope.MODULE_PATH = APP_CONFIG.MODULE_PATH;
    $scope.onIsAdminClicked = onIsAdminClicked;
    $scope.onIsAuthorizedClicked = onIsAuthorizedClicked;

    onLoad();

    function onLoad() {
        fetchUsers();

        ['created', 'deleted', 'updated'].forEach(function (e) {
            socket.forward('users:' + e, $scope);
            $scope.$on('socket:users:' + e, onUsersChanged);
        });

        function fetchUsers() {
            UsersFactory.query(function (data) {
                $scope.users = data;
            });
        }

        function onUsersChanged() {
            fetchUsers();
        }
    }

    function onIsAdminClicked(user) {
        user.isAdmin = !user.isAdmin;
        saveUserSettings(user);
    }

    function onIsAuthorizedClicked(user) {
        user.isAuthorized = !user.isAuthorized;
        saveUserSettings(user);
    }

    function saveUserSettings(user) {
        user.$save({
            },
            function success(value, responseHeaders) {
                toastr.success('User ' + user.username + ' settings saved.');
            }, function error(httpResponse) {
                toastr.error('Oops, something went wrong!');
                console.error('REST Error: ' + httpResponse.data.message);
            });
    }
  }

})();
