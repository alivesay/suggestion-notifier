(function() {
  'use strict';

  angular.module('app.notifier', [
    'app.config'
  ]);

  angular.module('app.notifier').config(notifierConfig);

  notifierConfig.$inject = ['$stateProvider', 'APP_CONFIG'];

  function notifierConfig($stateProvider, APP_CONFIG) {
    $stateProvider
      .state('notifier#index', {
        url: '/notifier',
        templateUrl: APP_CONFIG.APP_PATH + 'notifier/notifier.index.html'
      });
  }

  angular.module('app.notifier')
    .controller('NotifierIndexController', NotifierIndexController);

  function NotifierIndexController() {}

})();