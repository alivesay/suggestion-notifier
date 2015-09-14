(function(){
  'use strict';

  angular.module('app.shared').factory('AuthFactory', EventFactory);

  EventFactory.$inject = ['$resource'];

  function EventFactory($resource) {
    return $resource('/api/events/:id');
  }

})();