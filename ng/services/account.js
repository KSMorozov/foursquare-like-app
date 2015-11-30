angular.module('FourApp')
  .factory('Account', function ($http) {
    return {
      get_profile : function () {
        return $http.get('/api/me');
      },
      update_profile : function (profile_data) {
        return $http.put('/api/me', profile_data);
      },
      get_friends : function () {
        return $http.get('/api/me/friends');
      }
    }
  });
