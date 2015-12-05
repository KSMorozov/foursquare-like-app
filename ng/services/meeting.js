angular.module('FourApp')
  .factory('Meeting', function ($http) {
    return {
      fetch_meetings : function (user) {
        return $http.get('/api/meetings/owner', { params : { owner : user } });
      },
      new_meeting : function (meeting) {
        return $http.post('/api/meetings/', meeting);
      },
      fetch_meetings_filters : function (filters) {
        return $http.get('/api/meetings/', { params : filters });
      },
      cancel_meeting : function (id) {
        return $http.delete('/api/meetings/delete', { params : { id : id } });
      }
    }
  });
