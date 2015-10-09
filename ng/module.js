(function () {
  angular.module('FourApp', ['ngMaterial',
                             'ui.router',
                             'satellizer'])
  .run(['$rootScope', '$state', function($rootScope, $state) { $rootScope.$state = $state; }]);
})();
