(function () {
  angular.module('FourApp')
  .controller('SecondToolbarController', function ($scope, $rootScope) {
    var self = this;
    $scope.location = '';
    $scope.cities = [{ name : 'Москва'}, { name : 'Екатеринбург' }];

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
          $rootScope.user_city = location;
          $scope.$apply();
        });
      });
    });

    $scope.$watch(function () { return $scope.location }, function (new_value, old_value) {
      ymaps.ready(function () {
        ymaps.geocode(new_value, { results : 1 })
        .then(function (res) {
          var coords = res.geoObjects.get(0).geometry.getCoordinates();
          $rootScope.user_city_coords = coords;
          $rootScope.$emit('city_change', coords);
        });
      });
    });
  });
})();
