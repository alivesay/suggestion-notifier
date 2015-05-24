'use strict';

angular.module('suggestions', [
  'ngResource',
  'ui.router',
  'ui.grid',
  'ui.grid.selection',
  'ui.grid.autoResize',
  'ui.grid.resizeColumns',
  'ngDialog',
  'itemtypes'
]);

angular.module('suggestions')
  .controller('DialogTestController', function ($scope, ngDialog) {
    $scope.notifyClick = function () {
      ngDialog.open({ template: 'templateId'});
    }
  });

angular.module('suggestions').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('suggestions#index', {
      url: "/suggestions",
      templateUrl: "js/app/modules/suggestions/_index.html"
    })
    .state('suggestions#new', {
      url: "/suggestions/new",
      templateUrl: "js/app/modules/suggestions/_new.html"
    });
}]);

angular.module('suggestions')
  .factory('SuggestionFactory', ['$resource', function ($resource) {
    return $resource('/api/suggestions/:id');
  }]);

angular.module('suggestions')
  .controller('SuggestionsIndexController', ['$scope', 'uiGridConstants', function($scope, uiGridConstants) {
    $scope.suggestionsGridSelectionCount = 0;

    $scope.suggestionsGrid = {
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: true,
      //   enableSelectAll: false,
      columnDefs: [
        { name: 'id', visible: false, type: 'number'},
        { name: 'title', type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'author', type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'isbn' , type: 'string', displayName: 'ISBN' },
        { name: 'subject', type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'type', type: 'string' },
        { name: 'patron', type: 'string' }
      ]
    };

    $scope.suggestionsGrid.onRegisterApi = function(gridApi) {
      $scope.suggestionsGridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        $scope.suggestionsGridSelectionCount = gridApi.selection.getSelectedRows().length;
      });

      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
        $scope.suggestionsGridSelectionCount = gridApi.selection.getSelectedRows().length;
      });
    };

  }])
    .controller('SuggestionsNewController', ['$scope', '$state', 'SuggestionFactory', 'ItemTypesFactory', function($scope, $state, SuggestionFactory, ItemTypesFactory) {
      ItemTypesFactory.get(function(itemtypes) {
        $scope.itemtypes = itemtypes;
      });

      $scope.createNewSuggestion = function createNewSuggestion () {
        SuggestionFactory.save($scope.suggestion, function success (value, responseHeaders) {
          console.log('Hi')
          $state.go('suggestions#index');
        }, function error (httpResponse) {
          console.log('REST Error: ' + httpResponse.data.message);
        });
      };
  }])
    .controller('SuggestionsGridController', ['$scope', 'SuggestionFactory', function($scope, SuggestionFactory) {
    // TODO: create list() function and call at load
    SuggestionFactory.query(function(data) {
      $scope.suggestionsGrid.data = data;
    });
  }]);

