(function(){
  'use strict';

  angular.module('app.shared').factory('LocationsFactory', LocationsFactory);

  LocationsFactory.$inject = ['$resource'];

  function LocationsFactory($resource) {
    var resource = $resource('/api/locations');

    delete resource.$query;
    delete resource.$save;
    delete resource.$remove;
    delete resource.$delete;

    return resource;
  }

})();