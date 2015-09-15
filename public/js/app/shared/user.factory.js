(function(){
  'use strict';

  angular.module('app.shared').factory('UserFactory', UserFactory);

  UserFactory.$inject = ['$resource'];

  function UserFactory($resource) {
    return {
      login: function login (username, password) {
        var resource = $resource('/api/login');

        return resource.save({
          username: username,
          password: password
        }).$promise;
      },

      logout: function logout () {
        var resource = $resource('/api/logout');

        return resource.get().$promise;
      }
    }
  }

})();