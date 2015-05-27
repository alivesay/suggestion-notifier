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
  .controller('SuggestionsIndexController', ['$scope', 'uiGridConstants', 'ngDialog', function($scope, uiGridConstants, ngDialog) {
    $scope.suggestionsGridSelectionCount = 0;

    $scope.suggestionsGrid = {
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: true,
      //   enableSelectAll: false,
      columnDefs: [
        { name: 'id',
          visible: false,
          type: 'number',
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          }
        },
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

    $scope.newSuggestionClick = function newSuggestionClick() {
      ngDialog.open({
        template: '/js/app/modules/suggestions/_new.html',
        className: 'ngdialog-theme-default',
        scope: $scope
      });
    };
}])
    .controller('SuggestionsNewController', ['$scope', '$state', 'SuggestionFactory', 'ItemTypesFactory', 'toastr', function($scope, $state, SuggestionFactory, ItemTypesFactory, toastr) {
      ItemTypesFactory.get(function(itemtypes) {
        $scope.itemtypes = itemtypes;
      });

      $scope.createNewSuggestion = function createNewSuggestion () {
        SuggestionFactory.save($scope.suggestion, function success (value, responseHeaders) {
          $state.go('suggestions#index');
        }, function error (httpResponse) {
          toastr.error('Oops, something went wrong!');
          console.log('REST Error: ' + httpResponse.data.message);
        });

        $scope.closeThisDialog();
      };
  }])
    .controller('SuggestionsGridController', ['$scope', 'SuggestionFactory', 'uiGridConstants', 'socket', function($scope, SuggestionFactory, uiGridConstants, socket) {
    // TODO: create list() function and call at load

    SuggestionFactory.query(function(data) {
      console.log(data);
      $scope.suggestionsGrid.data = data;
    });

    socket.on('suggestions:created', function (suggestion) {
      $scope.suggestionsGrid.data.push(new SuggestionFactory(suggestion));
      $scope.suggestionsGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
      console.log($scope.suggestionsGrid.data);
    });
  }]);

