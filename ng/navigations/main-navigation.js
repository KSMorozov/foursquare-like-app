(function () {
  angular.module('FourApp')
    .controller('MainNavigation', function ($scope, $auth) {
      $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
      };
    });
})();
