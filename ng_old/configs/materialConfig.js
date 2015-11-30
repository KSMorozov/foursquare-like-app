(function () {
  angular.module('FourApp')
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange', {
      'default' : '500'
    })
    .accentPalette('deep-orange', {
      'default' : '500'
    });
    $mdThemingProvider.theme('background')
    .backgroundPalette('grey', {
      'default': '100'
    })
    .primaryPalette('grey', {
      'default': '100'
    })
    .accentPalette('grey', {
      'default': '100'
    });
  });
})();
