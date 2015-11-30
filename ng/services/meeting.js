angular.module('FourApp')
  .factory('Meeting', function ($http) {
    return {
      fetch_owner_meetings : function (owner) {
        return $http.get('/api/meetings/owner', { params : { owner : owner } });
      }
    }
  });
