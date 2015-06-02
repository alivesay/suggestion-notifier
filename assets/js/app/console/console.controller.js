(function() {
  'use strict';

  angular.module('app.console', [
    'app.config',
    'ui.chatroom'
  ]);

  angular.module('app.console').config(consoleConfig);

  consoleConfig.$inject = ['$stateProvider', 'APP_CONFIG'];

  function consoleConfig($stateProvider, APP_CONFIG) {
    $stateProvider
      .state('console#index', {
        url: '/console',
        templateUrl: APP_CONFIG.APP_PATH + 'console/console.index.html'
      });
  }

  angular.module('app.console')
    .controller('ConsoleIndexController', ConsoleIndexController);

  function ConsoleIndexController() {}

})();