(function(){
  'use strict';

  angular.module('app.console').factory('EventFactory', EventFactory);

  EventFactory.$inject = ['$resource'];

  function EventFactory($resource) {
    return $resource('/api/events/:id');
  }

})();