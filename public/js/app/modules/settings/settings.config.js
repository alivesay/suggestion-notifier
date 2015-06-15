(function(){
  'use strict';

  angular.module('app.settings').config(settingsConfig);

  settingsConfig.$inject = ['$stateProvider', 'APP_CONFIG'];

  function settingsConfig($stateProvider, APP_CONFIG) {
    $stateProvider
      .state('settings#index', {
        url: '/settings',
        templateUrl: APP_CONFIG.MODULE_PATH + 'settings/settings.index.html'
      });
  }

})();