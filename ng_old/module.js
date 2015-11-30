(function () {
  angular.module('FourApp', ['ngMaterial',
                             'ui.router',
                             'satellizer',
                             'ymaps'])
  .run(['$rootScope', '$state', function($rootScope, $state) { $rootScope.$state = $state; }]);
})();
