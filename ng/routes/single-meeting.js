(function () {
  angular.module('FourApp')
    .controller('Single-Meeting', function ($scope, $stateParams, Toast) {
      $scope.id = $stateParams.id;
    });
})();
