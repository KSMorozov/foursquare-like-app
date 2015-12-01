angular.module('FourApp')
  .factory('Meeting', function ($http) {
    return {
      fetch_meetings : function (user) {
        return $http.get('/api/meetings/owner', { params : { owner : user } });
      }
    }
  });
