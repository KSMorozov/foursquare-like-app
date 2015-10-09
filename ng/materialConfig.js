(function () {
  angular.module('FourApp')
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('grey', {
      'default' : '100'
    })
    .accentPalette('deep-orange');
  });
})();
