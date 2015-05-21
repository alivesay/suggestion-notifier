'use strict';

angular.module('ui.message-list', []);

angular.module('ui.message-list')
  .directive('uiMessageList', function () {
    return {
      restrict: 'E',
      replace: true,

      scope: { messages: '=',
        getMessageClasses: '=',
        autoScroll: '=',
        autoScrollSpeed: '=',
        fadeIn: '=',
        fadeInSpeed: '=',
        timestampFormat: '@' },

      template: '<div class="fill">' +
        '<div class="ui-message-list fill">' +
        '<ul>' +
        '<li data-ng-repeat="message in messages" data-ng-class="getMessageClasses(message)">' +
        '<span class="ui-message-list-timestamp" data-ng-bind="message.timestamp | date: timestampFormat"></span>' +
        '<span class="ui-message-list-source" data-ng-bind="message.source"></span>' +
        '<span class="ui-message-list-text" data-ng-bind="message.text"></span>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '</div>',

      link: function postLink(scope, element, attrs, controller) {
        scope.$watch('messages', function() {
          var uiMessageListDiv = element.find('.ui-message-list:first');

          if (scope.autoScroll === true) {
            uiMessageListDiv.stop().animate({ scrollTop: uiMessageListDiv.prop('scrollHeight') },
              parseInt(scope.autoScrollSpeed || 300, 10));
          }

          if (scope.fadeIn === true) {
            var lastMessageLi = uiMessageListDiv.find('li:last');
            if (lastMessageLi !== undefined) {
              lastMessageLi.stop().animate({ opacity: 1}, parseInt(scope.fadeInSpeed || 300, 10));
            }
          }
        }, true);
      }
    };
  });