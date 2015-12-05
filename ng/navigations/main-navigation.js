(function () {
  angular.module('FourApp')
    .controller('MainNavigation', function ($scope, $auth, $rootScope) {
      $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
      };

      // add event to listen to location change from rootScope
      $rootScope.$on('discovered_location', function (event, user) {
        $scope.user_city = user.city;
        $scope.$apply();
      });
    });
})();
