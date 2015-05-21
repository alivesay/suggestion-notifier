'use strict';

angular.module('ui.chatroom', [
  'ui.message-list'
]);

angular.module('ui.chatroom')
  .directive('uiChatroom', function () {
    return {
      restrict: 'E',
      replace: true,

      scope: { messages: '=',
        input: '=',
        username: '=',
        onSubmit: '=' },

      controller: function($scope) {
        $scope.getMessageClasses = function(message) {
          return { 'chatroom-message-list-alert': message.source == 'chatroom',
            'chatroom-message-list-directed': message.source !== $scope.username && message.text.match(new RegExp($scope.username, "i")) };
        };
      },

      template: '<div class="fill">' +
        '<div class="chatroom-message-list fill">' +
        '<ui-message-list data-messages="messages" ' +
        'data-get-message-classes="getMessageClasses" ' +
        'data-auto-scroll="true" ' +
        'data-fade-in="true" ' +
        'data-timestamp-format="HH:mm">' +
        '</div>' +
        '<div class="chatroom-input-box">' +
        '<form data-ng-submit="onSubmit()">' +
        '<fieldset>' +
        '<input data-ng-model="input" type="text" class="chatroom-input-box-text" placeholder="Enter text here to chat">' +
        '</fieldset>' +
        '</form>' +
        '</div>' +
        '</div>'
    };
  });