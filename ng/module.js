(function () {
  angular.module('FourApp', ['ui.router',
                             'satellizer',
                             'ymaps'])
  .run(['$rootScope', '$state', function($rootScope, $state) { $rootScope.$state = $state; }])
  .controller('App', function ($scope) {
    $scope.menu_hover = '';
  });
})();
