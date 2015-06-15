(function(){
  'use strict';

  angular.module('app.notifier')
    .controller('NotifierIndexController', NotifierIndexController);

  NotifierIndexController.$inject = ['$scope', '$q', 'TemplateFactory',
                                     'NoticeFactory', 'toastr' ];

  function NotifierIndexController($scope, $q, TemplateFactory,
                                   NoticeFactory, toastr) {

    $scope.notice = {};
    $scope.noticesSentCount = 0;
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
      $scope.sendClicked = true;

      // TODO: needs to be an async scrollbar
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
              toastr.error('Oops, something went wrong!');
              console.log('REST Error: ' + httpResponse.data.message);
            });
        });
      });

      promise.then(function() {
        toastr.success('All sent!');
        $scope.closeThisDialog();
      });
    }

  }

})();