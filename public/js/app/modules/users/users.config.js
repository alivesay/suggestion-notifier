(function(){
  'use strict';

  angular.module('app.users').config(usersConfig);

  usersConfig.$inject = ['$stateProvider', 'APP_CONFIG'];

  function usersConfig($stateProvider, APP_CONFIG) {
    $stateProvider
      .state('users#index', {
        url: '/users',
        templateUrl: APP_CONFIG.MODULE_PATH + 'users/users.index.html'
      });
  }

})();
