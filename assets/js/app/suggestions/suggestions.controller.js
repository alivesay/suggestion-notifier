(function() {
  'use strict';

  angular.module('app.suggestions', [
    'app.config',
    'ngResource',
    'ngAnimate',
    'ui.router',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns',
    'ngDialog',
    'app.console',
    'app.notifier',
    'app.shared'
  ]);

  angular.module('app.suggestions').config(suggestionsConfig);

  suggestionsConfig.$inject = ['$stateProvider', 'APP_CONFIG'];

  function suggestionsConfig($stateProvider, APP_CONFIG) {
    $stateProvider
      .state('suggestions#index', {
        url: '/suggestions',
        templateUrl: APP_CONFIG.APP_PATH + 'suggestions/suggestions.index.html'
      });
  }

  angular.module('app.suggestions').factory('SuggestionFactory', SuggestionFactory);

  SuggestionFactory.$inject = ['$resource'];

  function SuggestionFactory($resource) {
    return $resource('/api/suggestions/:id');
  }

  angular.module('app.suggestions')
    .controller('SuggestionsIndexController', SuggestionsIndexController);

  SuggestionsIndexController.$inject = ['$scope', 'socket', 'uiGridConstants',
                                        'ngDialog', 'SuggestionFactory', 'APP_CONFIG'];

  function SuggestionsIndexController($scope, socket, uiGridConstants,
                                      ngDialog, SuggestionFactory, APP_CONFIG) {
    var vm = this;

    vm.suggestionsGridSelectionCount = 0;
    vm.newSuggestionClick = newSuggestionClick;
    vm.notifyClick = notifyClick;

    vm.suggestionsGrid = {
      enableFiltering: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: true,
      enableSelectAll: false,
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
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'author', type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {name: 'isbn', type: 'string', displayName: 'ISBN'},
        {
          name: 'subject', type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {name: 'type', type: 'string'},
        {name: 'patron', type: 'string'}
      ],
      onRegisterApi: onRegisterApi
    };

    onLoad();

    function onLoad() {
      SuggestionFactory.query(function (data) {
        vm.suggestionsGrid.data = data;
      });

      socket.on('suggestions:created', function (suggestion) {
        vm.suggestionsGrid.data.push(new SuggestionFactory(suggestion));
        vm.suggestionsGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
      });
    }

    function onRegisterApi(gridApi) {
      vm.suggestionsGridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        vm.suggestionsGridSelectionCount = gridApi.selection.getSelectedRows().length;
        console.log(   vm.suggestionsGridSelectionCount)

      });

      gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
        $scope.suggestionsGridSelectionCount = gridApi.selection.getSelectedRows().length;
      });
    }

    function newSuggestionClick() {
      ngDialog.open({
        template: APP_CONFIG.APP_PATH + 'suggestions/suggestions.new.html',
        className: 'ngdialog-theme-default',
        scope: vm
      });
    }

    function notifyClick() {
      ngDialog.open({
        template: APP_CONFIG.APP_PATH + 'notifier/notifier.index.html',
        className: 'ngdialog-theme-default',
        scope: vm
      });
    }
  }

  angular.module('app.suggestions')
    .controller('SuggestionsNewController', SuggestionsNewController);

  SuggestionsNewController.$inject = ['$state', 'SuggestionFactory',
                                      'ItemTypesFactory', 'toastr'];

  function SuggestionsNewController($state, SuggestionFactory,
                                    ItemTypesFactory, toastr) {
    var vm = this;

    vm.createNewSuggestion = createNewSuggestion;

    ItemTypesFactory.get(function (itemtypes) {
      vm.itemtypes = itemtypes;
    });

    function createNewSuggestion() {
      SuggestionFactory.save(vm.suggestion, function success(value, responseHeaders) {
        $state.go('suggestions#index');
      }, function error(httpResponse) {
        toastr.error('Oops, something went wrong!');
        console.log('REST Error: ' + httpResponse.data.message);
      });

      vm.closeThisDialog();
    }
  }

})();