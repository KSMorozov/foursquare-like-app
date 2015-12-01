angular.module('FourApp')
  .factory('User', function ($http) {
    return {
      fetch_user : function (id) {
        return $http.get('/api/users/' + id);
      },
      follow_user : function (id) {
        return $http.post('/api/users/friend', { id : id });
      },
      fetch_friend_list : function (id) {
        return $http.get('/api/users/friends', { params : { id : id } });
      }
    }
  });
