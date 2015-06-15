(function(){
  'use strict';

  angular.module('ui.message-list', [
    'app.config',
    'ngAnimate'
  ]);

  angular.module('ui.message-list')
    .directive('uiMessageList', uiMessageList);

  uiMessageList.$inject = ['APP_CONFIG'];

  function uiMessageList(APP_CONFIG) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        messages: '=',
        getMessageClasses: '=',
        autoScroll: '=',
        autoScrollSpeed: '=',
        timestampFormat: '@'
      },
      templateUrl: APP_CONFIG.DIRECTIVE_PATH + 'message-list/message-list.html',

      controller: UiMessageListController
    };
  }

  UiMessageListController.$inject = ['$scope', '$element'];

  function UiMessageListController($scope, $element) {
    $scope.uiMessageListDiv = $element.find('div.ui-message-list');

    $scope.$on('ui-message-list:update', function () {
      updateMessageList();
    });

    function updateMessageList () {
      if ($scope.autoScroll === true) {
        $scope.uiMessageListDiv.stop().animate({
            scrollTop: $scope.uiMessageListDiv.prop('scrollHeight')
          },
          parseInt($scope.autoScrollSpeed || 300, 10));
      }
    }

    $scope.$emit('ui-message-list:loaded');

    //scope.$watch('messages', watchMessagesAndStyle, true);
  }

})();