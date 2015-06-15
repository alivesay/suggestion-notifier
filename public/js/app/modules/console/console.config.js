(function() {
  'use strict';

  angular.module('app.console').config(consoleConfig);

  consoleConfig.$inject = ['$stateProvider', 'APP_CONFIG'];

  function consoleConfig($stateProvider, APP_CONFIG) {
    $stateProvider
      .state('console#index', {
        url: '/console',
        templateUrl: APP_CONFIG.MODULE_PATH + 'console/console.index.html'
      });
  }

})();