(function() {
  'use strict';

  angular.module('app.login').config(loginConfig);

  loginConfig.$inject = ['$stateProvider', 'APP_CONFIG'];

  function loginConfig($stateProvider, APP_CONFIG) {
    $stateProvider
      .state('login#index', {
        url: '/login',
        templateUrl: APP_CONFIG.MODULE_PATH + 'login/login.index.html'
      });
  }

})();