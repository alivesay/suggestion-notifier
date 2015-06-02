(function(){
  'use strict';

  angular.module('ui.message-list', [
    'app.config'
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
        fadeIn: '=',
        fadeInSpeed: '=',
        timestampFormat: '@'
      },
      templateUrl: APP_CONFIG.COMPONENT_PATH + 'message-list/message-list.html',

      link: function postLink(scope, element, attrs, controller) {

        function watchMessagesAndStyle() {
          var uiMessageListDiv = element.find('.ui-message-list:first');

          if (scope.autoScroll === true) {
            uiMessageListDiv.stop().animate({
                scrollTop: uiMessageListDiv.prop('scrollHeight')
              },
              parseInt(scope.autoScrollSpeed || 300, 10));
          }

          if (scope.fadeIn === true) {
            var lastMessageLi = uiMessageListDiv.find('li:last');
            if (lastMessageLi !== undefined) {
              lastMessageLi.stop().animate({
                opacity: 1
              }, parseInt(scope.fadeInSpeed || 300, 10));
            }
          }
        }

        scope.$watch('messages', watchMessagesAndStyle, true);
      }
    };
  }

})();