(function() {
  'use strict';

  angular.module('app.templates')
    .controller('TemplatesIndexController', TemplatesIndexController);

  TemplatesIndexController.$inject = ['$scope', '$window', 'TemplateFactory', 'ngDialog',
                                      'toastr', 'socket', 'APP_CONFIG'];

  function TemplatesIndexController($scope, $window, TemplateFactory, ngDialog,
                                    toastr, socket, APP_CONFIG) {

    $scope.addTemplateClicked = addTemplateClicked;
    $scope.editTemplateClicked = editTemplateClicked;
    $scope.deleteTemplateClicked = deleteTemplateClicked;

    onLoad();

    function onLoad() {
      fetchTemplates();

      socket.on('templates:created', onTemplatesChanged);
      socket.on('templates:deleted', onTemplatesChanged);
      socket.on('templates:updated', onTemplatesChanged);

      function fetchTemplates() {
        TemplateFactory.query(function (data) {
          $scope.templates = data;
          $scope.templatesForm.id = undefined;
        });
      }

      function onTemplatesChanged (template) {
        fetchTemplates();
      }
    }

    function addTemplateClicked() {
      ngDialog.open({
        template: APP_CONFIG.MODULE_PATH + 'templates/templates.new.html',
        className: 'ngdialog-theme-default',
        scope: $scope
      });
    }

    function editTemplateClicked() {
      ngDialog.open({
        template: APP_CONFIG.MODULE_PATH + 'templates/templates.edit.html',
        className: 'ngdialog-theme-default',
        scope: $scope,
        data: { id: $scope.templatesForm.id }
      });
    }

    function deleteTemplateClicked() {
      if ($window.confirm('Really delete this template?') === false) {
        return;
      }

      TemplateFactory.delete({}, { 'id': $scope.templatesForm.id },
        function success(value, responseHeaders) {
        // TODO: emit socket
        toastr.success('Template deleted.');
      }, function error(httpResponse) {
        toastr.error('Oops, something went wrong!');
        console.error('REST Error: ' + httpResponse.data.message);
      });
    }
  }

  angular.module('app.templates')
    .controller('TemplatesNewController', TemplatesNewController);

  TemplatesNewController.$inject = ['$scope', '$state', 'toastr',
                                    'TemplateFactory'];

  function TemplatesNewController($scope, $state, toastr,
                                  TemplateFactory) {

    $scope.createTemplateClicked = createTemplateClicked;

    function createTemplateClicked() {
      TemplateFactory.save($scope.template, function success(value, responseHeaders) {
        toastr.success('New template created.');
      }, function error(httpResponse) {
        toastr.error('Oops, something went wrong!');
        console.error('REST Error: ' + httpResponse.data.message);
      });

      $scope.closeThisDialog();
    }
  }


  angular.module('app.templates')
    .controller('TemplatesEditController', TemplatesEditController);

  TemplatesEditController.$inject = ['$scope', '$state', 'toastr',
                                    'TemplateFactory'];

  function TemplatesEditController($scope, $state, toastr,
                                  TemplateFactory) {

    $scope.saveTemplateClicked = saveTemplateClicked;

    onLoad();

    function onLoad() {
      TemplateFactory.get({
        id: $scope.ngDialogData.id
      }, getTemplateSuccess, getTemplateError);

      function getTemplateSuccess(value, responseHeaders) {
        $scope.template = value;
      }

      function getTemplateError(httpResponse) {
        toastr.error('Oops, something went wrong!');
        console.error('REST Error: ' + httpResponse.data.message);
      }
    }

    function saveTemplateClicked() {
      $scope.template.$save({}, function success(value, responseHeaders) {
        toastr.success('Template updated.');
      }, function error(httpResponse) {
        toastr.error('Oops, something went wrong!');
        console.error('REST Error: ' + httpResponse.data.message);
      });

      $scope.closeThisDialog();
    }
  }

})();