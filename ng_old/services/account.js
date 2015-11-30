(function () {
  angular.module('FourApp')
  .factory('Account', function ($http) {
    return {
      getProfile : function () {
        return $http.get('/api/me');
      },
      updateProfile : function (profileData) {
        return $http.put('/api/me', profileData);
      },
      fetch_friends : function () {
        return $http.get('/api/me/friends');
      }
    };
  });
})();
