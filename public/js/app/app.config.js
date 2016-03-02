(function() {
  'use strict';

  angular.module('app.config', []);

  angular.module('app').config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$logProvider', '$locationProvider',
                       '$httpProvider', 'toastrConfig', 'ngDialogProvider'];

  function appConfig($stateProvider, $urlRouterProvider, $logProvider, $locationProvider,
                     $httpProvider, toastrConfig, ngDialogProvider) {
    $urlRouterProvider.otherwise('/suggestions');
    $locationProvider.html5Mode(true);

    angular.extend(toastrConfig, {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-left'
    });

    $httpProvider.interceptors.push('TokenInterceptorFactory');

    $logProvider.debugEnabled(true);

    ngDialogProvider.setForceHtmlReload(true);
    ngDialogProvider.setForceBodyReload(true);
    ngDialogProvider.setDefaults({
        closeByDocument: false,
        className: 'ngdialog-theme-default ngdialog-overlay',
    });
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
      if (AuthFactory.isAuthenticated === false) {
        $state.go('login#index');
      }
    });
  }


})();
