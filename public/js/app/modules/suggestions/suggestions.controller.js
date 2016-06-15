(function() {
  'use strict';

  angular.module('app.suggestions')
    .controller('SuggestionsIndexController', SuggestionsIndexController);

  SuggestionsIndexController.$inject = ['$scope', '$filter', '$q', 'socket', 'uiGridConstants',
                                        'ngDialog', 'toastr', 'SuggestionFactory', 'APP_CONFIG',
                                        '$window', 'WebNotifyFactory'];

  function SuggestionsIndexController($scope, $filter, $q, socket, uiGridConstants,
                                      ngDialog, toastr, SuggestionFactory, APP_CONFIG,
                                      $window, WebNotifyFactory) {

    $scope.suggestionsGridSelectionCount = 0;
    $scope.MODULE_PATH = APP_CONFIG.MODULE_PATH;
    $scope.isViewingReferred = false;
    $scope.suggestionTabClick = suggestionTabClick;
    $scope.newSuggestionClick = newSuggestionClick;
    $scope.notifyClick = notifyClick;
    $scope.referClick = referClick;
    $scope.holdClick = holdClick;
    $scope.deleteClick = deleteClick;
    $scope.singleFilter = singleFilter;
    $scope.onLongPressEnd = onLongPressEnd;
    $scope.newCount = 0;
    $scope.referredCount = 0;

    $scope.suggestionsGrid = {
      enableColumnMenus: false,
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
          cellTemplate: '<div class="ui-grid-cell-contents" ui-on-long-press="grid.appScope.onLongPressEnd(row)">{{ row.entity.title == "NULL" ? "" : row.entity.title }}</div>'
        },
        {
          name: 'subject', type: 'string',
          filter: {
            condition: columnFilterContains
          },
          width: '*',
          minWidth: 20,
          cellTemplate: '<div class="ui-grid-cell-contents" ui-on-long-press="grid.appScope.onLongPressEnd(row)">{{ row.entity.subject == "NULL" ? "" : row.entity.subject }}</div>'
        },
        {
          name: 'author', type: 'string',
          filter: {
            condition: columnFilterContains
          },
          cellTemplate: '<div class="ui-grid-cell-contents" ui-on-long-press="grid.appScope.onLongPressEnd(row)">{{ row.entity.author == "NULL" ? "" : row.entity.author }}</div>'
        },
        {
          name: 'isbn',
          type: 'string',
          displayName: 'ISBN',
          maxWidth: 130,
          filter: {
            condition: columnFilterContains
          },
          cellTemplate: '<div class="ui-grid-cell-contents" ui-on-long-press="grid.appScope.onLongPressEnd(row)">{{ row.entity.isbn == "NULL" ? "" : row.entity.isbn }}</div>'
        },
        {
          name: 'type',
          type: 'string',
          displayName: 'Format',
          filter: {
            condition: columnFilterStartsWith
          },
          minWidth: 60,
          width: 95,
          cellTemplate: '<div class="ui-grid-cell-contents" ui-on-long-press="grid.appScope.onLongPressEnd(row)">{{ row.entity.type }}</div>'
        },
        {
          name: 'listRef',
          type: 'string',
          displayName: 'List #',
          filter: {
            condition: columnFilterContains
          },
          minWidth: 60,
          maxWidth: 95,
          cellTemplate: '<div class="ui-grid-cell-contents" ui-on-long-press="grid.appScope.onLongPressEnd(row)">{{ row.entity.listRef }}</div>'
        },
        {
          name: 'patron',
          type: 'string',
          maxWidth: 130,
          filter: {
            condition: columnFilterContains
          },
          cellTemplate: '<div class="ui-grid-cell-contents" ui-on-long-press="grid.appScope.onLongPressEnd(row)">{{ row.entity.patron == "NULL" ? "" : row.entity.patron }}</div>'
        },
        {
          name: 'createdAt',
          type: 'date',
          displayName: 'Date',
          width: 90,
          filter: {
            condition: columnFilterContains
          },
          cellTemplate: '<div class="ui-grid-cell-contents" ui-on-long-press="grid.appScope.onLongPressEnd(row)">{{ row.entity.createdAt | date:"yyyy-MM-dd" }}</div>'
        }
      ],
      onRegisterApi: onRegisterApi
    };

    onLoad();

    function onLoad() {
      fetchSuggestions();

      // hack to fix auto-resize issues
      function _resizeHack() {
          $scope.suggestionsGridApi.core.scrollTo($scope.suggestionsGrid.data[0], $scope.suggestionsGrid.columnDefs[0]);
      }
      $scope.$on('console:wasclosed', _resizeHack);
      $scope.$on('console:wasminimized', _resizeHack);
      $scope.$on('console:wasopened', _resizeHack);

      socket.forward('suggestions:created', $scope);
      $scope.$on('socket:suggestions:created', function (ev, suggestion) {
        $scope.suggestionsGrid.data.push(new SuggestionFactory(suggestion));
        $scope.suggestionsGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        WebNotifyFactory.show('New Suggestion', suggestion.title);
      });

      socket.forward('suggestions:updated', $scope);
      $scope.$on('socket:suggestions:updated', function (ev, suggestion) {
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
      });

      socket.forward('suggestions:deleted', $scope);
      $scope.$on('socket:suggestions:deleted', function (ev, suggestion) {
        angular.forEach($scope.suggestionsGrid.data, function (suggestionRow, key) {
          if (suggestionRow.id === suggestion.id) {
            $scope.suggestionsGridApi.selection.unSelectRow(suggestionRow);
            delete $scope.suggestionsGrid.data[key];
            $scope.suggestionsGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
          }
        });
      });

      socket.forward('notices:sent', $scope);
      $scope.$on('socket:notices:sent', function () {
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

      resizeGrid();
      $($window).resize(resizeGrid);
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
        scope: $scope
      });
    }

    function notifyClick() {
      ngDialog.open({
        template: APP_CONFIG.MODULE_PATH + 'notifier/notifier.index.html',
        scope: $scope,
        data: $scope.suggestionsGridApi.selection.getSelectedRows()
      });
    }

    function referClick() {
      setReferred(true);
    }

    function holdClick() {
      setReferred(false);
    }

    function setReferred(isReferred) {
      var promises = [];

      angular.forEach($scope.suggestionsGridApi.selection.getSelectedRows(), function (row) {
        SuggestionFactory.get({id: row.id}, function (suggestion) {
          suggestion.isReferred = isReferred;
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

      if ($window.confirm('Are you sure?')) {
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

    function onLongPressEnd(row) {
        ngDialog.open({
            template: APP_CONFIG.MODULE_PATH + 'suggestions/suggestions.edit.html',
            scope: $scope,
            data: { id: row.entity.id }
        });
    }

    function setColumnsVisibility(indices, visibility) {
        angular.forEach(indices, function (index) {
            $scope.suggestionsGrid.columnDefs[index].visible = visibility;
        });
        $scope.suggestionsGridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    }


    function resizeGrid() {
        var responsiveColumns = [4,5,6,7]; // ISBN, Format, Patron, Date
        var responsiveWidth = 768;

        if ($window.innerWidth < responsiveWidth) {
            if ($scope.suggestionsGrid.columnDefs[responsiveColumns[0]].visible !== false) {
                setColumnsVisibility(responsiveColumns, false);
            }
        } else if ($scope.suggestionsGrid.columnDefs[responsiveColumns[0]].visible !== true) {
            setColumnsVisibility(responsiveColumns, true);
        }
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


  angular.module('app.suggestions')
    .controller('SuggestionsEditController', SuggestionsEditController);

  SuggestionsEditController.$inject = ['$scope', '$state', '$window', 'toastr',
                                       'SuggestionFactory', 'ItemTypesFactory', 'LocationsFactory'];

  function SuggestionsEditController($scope, $state, $window, toastr,
                                     SuggestionFactory, ItemTypesFactory, LocationsFactory) {

    $scope.saveSuggestionClicked = saveSuggestionClicked;
    $scope.deleteSuggestionClicked = deleteSuggestionClicked;

    ItemTypesFactory.get(function (itemtypes) {
      $scope.itemtypes = itemtypes;
    });

    LocationsFactory.get(function (locations) {
      $scope.locations = locations;
    });

    onLoad();

    function onLoad() {
      SuggestionFactory.get({
        id: $scope.ngDialogData.id
      }, getSuggestionSuccess, getSuggestionError);

      function getSuggestionSuccess(value, responseHeaders) {
        $scope.suggestion = value;
      }

      function getSuggestionError(httpResponse) {
        toastr.error('Oops, something went wrong!');
        console.error('REST Error: ' + httpResponse.data.message);
      }
    }

    function saveSuggestionClicked() {
      $scope.suggestion.$save({}, function success(value, responseHeaders) {
        toastr.success('Suggestion updated.');
      }, function error(httpResponse) {
        toastr.error('Oops, something went wrong!');
        console.error('REST Error: ' + httpResponse.data.message);
      });

      $scope.closeThisDialog();
    }

    function deleteSuggestionClicked() {
      if ($window.confirm('Are you sure?')) {
          $scope.suggestion.$delete({}, function success(value, responseHeaders) {
            toastr.success('Suggestion deleted.');
          }, function error(httpResponse) {
            toastr.error('Oops, something went wrong!');
            console.error('REST Error: ' + httpResponse.data.message);
          });

          $scope.closeThisDialog();
      }
    }

  }

})();
