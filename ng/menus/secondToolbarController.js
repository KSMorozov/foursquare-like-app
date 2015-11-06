(function () {
  angular.module('FourApp')
  .controller('SecondToolbarController', function ($scope, $rootScope) {
    var self = this;
    $scope.location = '';
    $scope.cities = ['Москва', 'Екатеринбург'];

    ymaps.ready(function () {
      var geolocation = ymaps.geolocation;
      geolocation.get({ provider : 'browser' })
      .then(function (res) {
        var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
        ymaps.geocode(coordinates, {
          results : 1
        }).then(function (res) {
          var location = res.geoObjects.get(0).properties.get('text').split(',')[1];
          $scope.location = location;
          $scope.$apply();
          $rootScope.user_city = location;
        });
      });
    });
  });
})();
