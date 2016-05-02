(function(){
  'use strict';

  angular.module('app.shared').factory('UsersFactory', UsersFactory);

  UsersFactory.$inject = ['$resource'];

  function UsersFactory($resource) {
    return $resource(
        '/api/users/:id',
        { id: '@id' }
    );
  }

})();
