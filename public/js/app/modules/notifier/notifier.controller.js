(function(){
  'use strict';

  angular.module('app.notifier')
    .controller('NotifierIndexController', NotifierIndexController);

  NotifierIndexController.$inject = ['$scope', 'TemplateFactory', 'ngDialog',
                                     'APP_CONFIG'];

  function NotifierIndexController($scope, TemplateFactory, ngDialog,
                                   APP_CONFIG) {

    $scope.notice = {};
    $scope.sendNoticeClicked = sendNoticeClicked;

    onLoad();

    function onLoad() {
      fetchTemplates();
    }

    function fetchTemplates() {
      TemplateFactory.query(function (data) {
        // TODO: handle case of no templates
        $scope.templates = data;
        $scope.notice.template = $scope.templates[0];
      });
    }

    function sendNoticeClicked() {

      ngDialog.open({
        template: APP_CONFIG.MODULE_PATH + 'notifier/notifier.sending.html',
        className: 'ngdialog-theme-sending',
        scope: $scope,
        data: $scope.ngDialogData,
        showClose: false,
        closeByEscape: false,
        closeByDocument: false
      });
    }

  }

  angular.module('app.notifier')
    .controller('NotifierSendingController', NotifierSendingController);

  NotifierSendingController.$inject = ['$scope', '$q', 'NoticeFactory',
                                       'toastr' ];

  function NotifierSendingController($scope, $q, NoticeFactory,
                                     toastr) {

    $scope.noticesSentCount = 0;

    onLoad();

    function onLoad() {
      var promise = $q.all(null);

      angular.forEach($scope.ngDialogData, function (suggestion){
        promise = promise.then(function () {
          $scope.notice.suggestionId = suggestion.id;
          $scope.notice.suggestionPatron = suggestion.patron;
          return NoticeFactory.save($scope.notice).$promise
            .then(function success(value, responseHeaders) {
              $scope.noticesSentCount++;
            })
            .catch(function error(httpResponse) {
              return $q.reject(httpResponse.data.message)
            });
        });
      });

      promise
        .then(function() {
          toastr.success('All sent!');
        })
        .catch(function(reason) {
          toastr.error('Oops, something went wrong.');
          console.error(reason);
        })
        .finally(function() {
          $scope.closeThisDialog();
        });
    }
  }

  })();