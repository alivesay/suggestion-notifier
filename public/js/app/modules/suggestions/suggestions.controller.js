(function() {
  'use strict';

  angular.module('app.suggestions')
    .controller('SuggestionsIndexController', SuggestionsIndexController);

  SuggestionsIndexController.$inject = ['$scope', '$filter', '$q', 'socket', 'uiGridConstants',
                                        'ngDialog', 'toastr', 'SuggestionFactory', 'APP_CONFIG'];

  function SuggestionsIndexController($scope, $filter, $q, socket, uiGridConstants,
                                      ngDialog, toastr, SuggestionFactory, APP_CONFIG) {
    $scope.suggestionsGridSelectionCount = 0;
    $scope.MODULE_PATH = APP_CONFIG.MODULE_PATH;
    $scope.isViewingReferred = false;
    $scope.suggestionTabClick = suggestionTabClick;
    $scope.newSuggestionClick = newSuggestionClick;
    $scope.notifyClick = notifyClick;
    $scope.referClick = referClick;
    $scope.deleteClick = deleteClick;
    $scope.singleFilter = singleFilter;
    $scope.newCount = 0;
    $scope.referredCount = 0;

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
          minWidth: 30,
          cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.title == "NULL" ? "" : row.entity.title }}</div>'
        },
        {
          name: 'subject', type: 'string',
          filter: {
            condition: columnFilterContains
          },
          width: '*',
          minWidth: 20,
          cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.subject == "NULL" ? "" : row.entity.subject }}</div>'
        },
        {
          name: 'author', type: 'string',
          filter: {
            condition: columnFilterContains
          },
          cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.author == "NULL" ? "" : row.entity.author }}</div>'
        },
        {
          name: 'isbn',
          type: 'string',
          displayName: 'ISBN',
          maxWidth: 130,
          filter: {
            condition: columnFilterContains
          },
          cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.isbn == "NULL" ? "" : row.entity.isbn }}</div>'
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
          maxWidth: 130,
          filter: {
            condition: columnFilterContains
          },
          cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.patron == "NULL" ? "" : row.entity.patron }}</div>'
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

      socket.on('suggestions:updated', function (suggestion) {
        var foundSuggestion = false;

        for(var i = 0; i < $scope.suggestionsGrid.data.length; ++i) {
          if ($scope.suggestionsGrid.data[i].id === suggestion.id) {
            $scope.suggestionsGrid.data[i] = suggestion;
            foundSuggestion = true;
            break;
          }
        }

        if (!foundSuggestion) {
          $scope.suggestionsGrid.data.push(new SuggestionFactory(suggestion));
        }

        $scope.suggestionsGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        console.log($scope.suggestionsGridSelectionCount)
      });

      socket.on('suggestions:deleted', function (suggestion) {
        angular.forEach($scope.suggestionsGrid.data, function (suggestionRow, key) {
          if (suggestionRow.id === suggestion.id) {
            $scope.suggestionsGridApi.selection.unSelectRow(suggestionRow);
            delete $scope.suggestionsGrid.data[key];
            $scope.suggestionsGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
          }
        });
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
      $scope.suggestionsGridApi.grid.registerRowsProcessor($scope.singleFilter, 75);


      $scope.refreshClick = function refreshClick () {
        refreshGridView();
      };

      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        $scope.suggestionsGridSelectionCount = gridApi.selection.getSelectedRows().length;
      });

      gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
        $scope.suggestionsGridSelectionCount = gridApi.selection.getSelectedRows().length;
      });
    }

    function refreshGridView () {
      $scope.suggestionsGridApi.selection.clearSelectedRows();
      $scope.suggestionsGridApi.core.clearAllFilters();
      $scope.suggestionsGridApi.grid.resetColumnSorting();
      $scope.suggestionsGridApi.core.queueGridRefresh();
      $scope.suggestionsGridApi.core.refresh();
      $scope.suggestionsGridApi.grid.refreshCanvas();
      $scope.suggestionsGridApi.grid.refreshRows();
    }

    function singleFilter(renderableRows) {
      $scope.referredCount = 0;
      $scope.newCount = 0;

      renderableRows.forEach(function(row) {
        var isReferred = !!row.entity.isReferred;

        if (isReferred) {
          $scope.referredCount++;
        } else {
          $scope.newCount++;
        }
        row.visible = $scope.isViewingReferred
          ? isReferred === true
          : isReferred === false
      });

      return renderableRows;
    }

    function suggestionTabClick(tab) {
      $scope.isViewingReferred = tab === 'referred';
      refreshGridView();
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

    function referClick() {
      var promises = [];

      angular.forEach($scope.suggestionsGridApi.selection.getSelectedRows(), function (row) {
        SuggestionFactory.get({id: row.id}, function (suggestion) {
          suggestion.isReferred = true;
          promises.push(suggestion.$save());
        })
      });

      $q
        .all(promises)
        .catch(function error(httpResponse) {
          toastr.error('Oops, something went wrong!');
          console.error('REST Error: ' + httpResponse.data.message);
        })
        .finally(function () {
          $scope.suggestionsGridApi.selection.clearSelectedRows();
        });
    }

    function deleteClick() {
      var promises = [];

      angular.forEach($scope.suggestionsGridApi.selection.getSelectedRows(), function (row) {
          promises.push(SuggestionFactory.delete({id: row.id}).$promise);
      });

      $q
        .all(promises)
        .catch(function error(httpResponse) {
          toastr.error('Oops, something went wrong!');
          console.error('REST Error: ' + httpResponse.data.message);
        })
        .finally(function () {
          $scope.suggestionsGridApi.selection.clearSelectedRows();
        });
    }


  }

  angular.module('app.suggestions')
    .controller('SuggestionsNewController', SuggestionsNewController);

  SuggestionsNewController.$inject = ['$scope', '$state', 'SuggestionFactory',
                                      'ItemTypesFactory', 'LocationsFactory', 'toastr'];

  function SuggestionsNewController($scope, $state, SuggestionFactory,
                                    ItemTypesFactory, LocationsFactory, toastr) {

    $scope.createNewSuggestion = createNewSuggestion;

    ItemTypesFactory.get(function (itemtypes) {
      $scope.itemtypes = itemtypes;
    });

    LocationsFactory.get(function (locations) {
      $scope.locations = locations;
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
