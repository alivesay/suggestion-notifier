(function() {
  'use strict';

  angular.module('app.suggestions')
    .controller('SuggestionsIndexController', SuggestionsIndexController);

  SuggestionsIndexController.$inject = ['$scope', '$filter', 'socket', 'uiGridConstants',
                                        'ngDialog', 'SuggestionFactory', 'APP_CONFIG'];

  function SuggestionsIndexController($scope, $filter, socket, uiGridConstants,
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
            direction: uiGridConstants.ASC,
            priority: 0
          }
        },
        {
          name: 'title', type: 'string',
          filter: {
            condition: columnFilterContains
          },
          width: '*',
          minWidth: 30
        },
        {
          name: 'author', type: 'string',
          filter: {
            condition: columnFilterContains
          }
        },
        {
          name: 'isbn',
          type: 'string',
          displayName: 'ISBN',
          maxWidth: 130,
          filter: {
            condition: columnFilterContains
          }
        },
        {
          name: 'subject', type: 'string', visible: false,
          filter: {
            condition: columnFilterContains
          }
        },
        {
          name: 'type',
          type: 'string',
          displayName: 'Format',
          filter: {
            condition: columnFilterStartsWith
          },
          width: 95
        },
        {
          name: 'patron',
          type: 'string',
          axWidth: 130,
          filter: {
            condition: columnFilterContains
          }
        },
        {
          name: 'createdAt',
          type: 'date',
          displayName: 'Date',
          cellFilter: 'date:"yyyy-MM-dd"',
          width: 90,
          filter: {
            condition: columnFilterContains
          }
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
      });
    }

    function fetchSuggestions() {
      SuggestionFactory.query(function (data) {
        $scope.suggestionsGrid.data = data;
      });
    }

    // uiGrid's custom filter 'term' has been escaped for special regex chars
    // See: https://github.com/angular-ui/ng-grid/issues/2475

    function getSafeFilterTermString(term) {
      return term.replace(/\\/g, '');
    }

    function getSafeFilterValueString(value) {
      var filterValue = value;

      if (value instanceof Date) {
        filterValue = $filter('date')(value, 'yyyy-MM-dd');
      } else if (value === null || value === undefined) {
        filterValue = '';
      }

      return filterValue;
    }

    function columnFilterContains (term, value, row, col) {
      var filterTerm = getSafeFilterTermString(term);
      var filterValue = getSafeFilterValueString(value);

      return filterValue.toLowerCase().indexOf(filterTerm.toLowerCase()) > -1
        || row.isSelected;
    }
    
    function columnFilterStartsWith (term, value, row, col) {
      var filterTerm = getSafeFilterTermString(term);
      var filterValue = getSafeFilterValueString(value);

      return filterValue.toLowerCase().indexOf(filterTerm.toLowerCase()) === 0
        || row.isSelected;
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
        console.error('REST Error: ' + httpResponse.data.message);
      });

      $scope.closeThisDialog();
    }
  }

})();