'use strict';

angular.module('app', [
  'ngResource',
  'ui.router',
  'angular-loading-bar',
  'ui.bootstrap',
  'suggestions'
]);


angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/suggestions");
}]);