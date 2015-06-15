(function() {
  'use strict';

  angular.module('app.suggestions')
    .controller('SuggestionsIndexController', SuggestionsIndexController);

  var customSuggestionFilters = {
    contains: function contains (term, value, row, col) {
      return value.toLowerCase().indexOf(term.toLowerCase()) > -1
          || row.isSelected;
    },
    startsWith: function startsWith (term, value, row, col) {
      return value.toLowerCase().indexOf(term.toLowerCase()) === 0
          || row.isSelected;
    }
  };

  SuggestionsIndexController.$inject = ['$scope', 'socket', 'uiGridConstants',
                                        'ngDialog', 'SuggestionFactory', 'APP_CONFIG'];

  function SuggestionsIndexController($scope, socket, uiGridConstants,
                                      ngDialog, SuggestionFactory, APP_CONFIG) {
    $scope.suggestionsGridSelectionCount = 0;
    $scope.MODULE_PATH = APP_CONFIG.MODULE_PATH;
    $scope.newSuggestionClick = newSuggestionClick;
    $scope.notifyClick = notifyClick;

    $scope.suggestionsGrid = {
      enableFiltering: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      rowHeight: 24,
      multiSelect: true,
      enableSelectAll: false,
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      columnDefs: [
        {
          name: 'id', type: 'number', visible: false,
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          }
        },
        {
          name: 'title', type: 'string',
          filter: {
            condition: customSuggestionFilters.contains
          },
          width: '*',
          minWidth: 30
        },
        {
          name: 'author', type: 'string',
          filter: {
            condition: customSuggestionFilters.contains
          }
        },
        {
          name: 'isbn',
          type: 'string',
          displayName: 'ISBN',
          maxWidth: 130
        },
        {
          name: 'subject', type: 'string', visible: false,
          filter: {
            condition: customSuggestionFilters.contains
          }
        },
        {
          name: 'type',
          type: 'string',
          displayName: 'Format',
          filter: {
            condition: customSuggestionFilters.startsWith
          },
          width: 95
        },
        {
          name: 'patron',
          type: 'string',
          maxWidth: 130
        },
        {
          name: 'createdAt',
          type: 'date',
          displayName: 'Date',
          cellFilter: 'date:"yyyy-MM-dd"',
          width: 90
        }
      ],
      onRegisterApi: onRegisterApi
    };

    onLoad();

    function onLoad() {

      fetchSuggestions();

      socket.on('suggestions:created', function (suggestion) {
        $scope.suggestionsGrid.data.push(new SuggestionFactory(suggestion));
        $scope.suggestionsGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
      });

      socket.on('notices:sent', function () {
        $scope.suggestionsGridApi.selection.clearSelectedRows();
        fetchSuggestions();
        fetchSuggestions();
      });
    }

    function fetchSuggestions() {
      SuggestionFactory.query(function (data) {
        $scope.suggestionsGrid.data = data;
      });
    }

    function onRegisterApi(gridApi) {
      $scope.suggestionsGridApi = gridApi;

      $scope.refreshClick = function refreshClick () {
        $scope.suggestionsGridApi.selection.clearSelectedRows();
        $scope.suggestionsGridApi.core.clearAllFilters();
        $scope.suggestionsGridApi.grid.resetColumnSorting();
      };

      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        $scope.suggestionsGridSelectionCount = gridApi.selection.getSelectedRows().length;
      });

      gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
        $scope.suggestionsGridSelectionCount = gridApi.selection.getSelectedRows().length;
      });
    }

    function newSuggestionClick() {
      ngDialog.open({
        template: APP_CONFIG.MODULE_PATH + 'suggestions/suggestions.new.html',
        className: 'ngdialog-theme-default',
        scope: $scope
      });
    }

    function notifyClick() {
      ngDialog.open({
        template: APP_CONFIG.MODULE_PATH + 'notifier/notifier.index.html',
        className: 'ngdialog-theme-default',
        scope: $scope,
        data: $scope.suggestionsGridApi.selection.getSelectedRows()
      });
    }
  }

  angular.module('app.suggestions')
    .controller('SuggestionsNewController', SuggestionsNewController);

  SuggestionsNewController.$inject = ['$scope', '$state', 'SuggestionFactory',
                                      'ItemTypesFactory', 'toastr'];

  function SuggestionsNewController($scope, $state, SuggestionFactory,
                                    ItemTypesFactory, toastr) {

    $scope.createNewSuggestion = createNewSuggestion;

    ItemTypesFactory.get(function (itemtypes) {
      $scope.itemtypes = itemtypes;
    });

    function createNewSuggestion() {
      SuggestionFactory.save($scope.suggestion, function success(value, responseHeaders) {
        $state.go('suggestions#index');
      }, function error(httpResponse) {
        toastr.error('Oops, something went wrong!');
        console.log('REST Error: ' + httpResponse.data.message);
      });

      $scope.closeThisDialog();
    }
  }

})();