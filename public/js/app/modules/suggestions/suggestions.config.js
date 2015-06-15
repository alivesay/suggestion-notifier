(function(){
  'use strict';

  angular.module('app.suggestions').config(suggestionsConfig);

  suggestionsConfig.$inject = ['$stateProvider', 'APP_CONFIG'];

  function suggestionsConfig($stateProvider, APP_CONFIG) {
    $stateProvider
      .state('suggestions#index', {
        url: '/suggestions',
        templateUrl: APP_CONFIG.MODULE_PATH + 'suggestions/suggestions.index.html'
      });
  }

})();