(function() {
  'use strict';

  angular.module('app.config', []);

  angular.module('app').config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$logProvider',
                       '$httpProvider', 'toastrConfig'];

  function appConfig($stateProvider, $urlRouterProvider, $logProvider,
                     $httpProvider, toastrConfig) {
    $urlRouterProvider.otherwise('/suggestions');

    angular.extend(toastrConfig, {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-left'
    });

    $httpProvider.interceptors.push('TokenInterceptorFactory');

    $logProvider.debugEnabled(true);
  }

  var APP_PATH = '/js/app/';

  angular.module('app.config')
    .constant('APP_CONFIG', {
      APP_PATH: APP_PATH,
      DIRECTIVE_PATH: APP_PATH + 'directives/',
      MODULE_PATH: APP_PATH + 'modules/'
    });

  angular.module('app').run(appRun);

  appRun.$inject = ['$rootScope', '$state', '$window', 'AuthFactory'];

  function appRun ($rootScope, $state, $window, AuthFactory) {
    $rootScope.$on('$locationChangeSuccess', function() {
      if (AuthFactory.isLogged === false) {
        $state.go('login#index');
      }
    });
  }


})();
