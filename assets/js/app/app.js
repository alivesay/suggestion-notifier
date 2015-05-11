'use strict';

angular.module('app', [
  'ngResource',
  'ui.bootstrap'
]);

angular.module('app').config(['$locationProvider', function($locationProvider) {
 // $locationProvider.html5Mode(true);
}]);

angular.module('app').controller('AppController', function () {});

angular.module('app.services', []);

angular.module('app.services')
  .factory('Suggestion', function ($resource) {
    return $resource('/api/suggestions/:id');
  });

angular.module('app.controllers', []);

angular.module('app.controllers')
  .controller('SuggestionsIndexController', function($scope, Suggestion) {
    console.log('I WUZ HERE');
    Suggestion.query(function(data) {
      $scope.suggestions = data;
    });
  });