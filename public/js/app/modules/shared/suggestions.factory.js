(function(){
  'use strict';

  angular.module('app.shared').factory('SuggestionFactory', SuggestionFactory);

  SuggestionFactory.$inject = ['$resource'];

  function SuggestionFactory($resource) {
    return $resource('/api/suggestions/:id');
  }

})();