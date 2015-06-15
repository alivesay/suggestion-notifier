(function() {
  'use strict';

  angular.module('app.config', []);

  angular.module('app').config(appConfig);

  appConfig.$inject = ['$urlRouterProvider', 'toastrConfig'];

  function appConfig($urlRouterProvider, toastrConfig) {
    $urlRouterProvider.otherwise('/suggestions');

    angular.extend(toastrConfig, {
      closeButton: true,
      progressBar: true
    });
  }

  var APP_PATH = '/js/app/';

  angular.module('app.config')
    .constant('APP_CONFIG', {
      APP_PATH: APP_PATH,
      DIRECTIVE_PATH: APP_PATH + 'directives/',
      MODULE_PATH: APP_PATH + 'modules/'
    });

})();