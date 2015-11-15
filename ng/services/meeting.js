(function () {
  angular.module('FourApp')
  .factory('Meeting', function ($http) {
    return {
      create_meeting : function (meeting) {
        return $http.post('/api/meetings', meeting);
      },
      fetch_meetings : function (filters) {
        return $http.get('/api/meetings/', { params : filters });
      },
      fetch_meeting : function (id) {
        return $http.get('/api/meetings/single', { params : { id : id } });
      },
      attend_meeting : function (meeting) {
        return $http.post('/api/meetings/attend', { id : meeting });
      }
    };
  });
})();
