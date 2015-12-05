(function () {
  angular.module('FourApp')
    .controller('App', function ($scope, $rootScope, $timeout) {
      $scope.menu_hover = '';

      function init () {
        ymaps.ready(function () {
          $rootScope.geolocation = ymaps.geolocation;
          $rootScope.map = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 8,
            controls : []
          }, {
            searchControlProvider: 'yandex#search'
          });

          // discover user location
          ymaps.geolocation.get({
            provider : 'browser',
            mapStateAutoApply: true
          }).then(function (res) {
            $rootScope.user_city = res.geoObjects.get(0).properties.get('text').split(', ')[1];

            // get coordinates of the city center user located in
            ymaps.geocode($rootScope.user_city, {
              results : 1
            }).then(function (res) {
              $rootScope.user_coordinates = res.geoObjects.get(0).geometry.getCoordinates();

              $rootScope.$emit('discovered_location', {
                city : $rootScope.user_city,
                coordinates : $rootScope.user_coordinates
              });
            });

          });
        });
      }

      $timeout(function () {
        $(document).ready(function(){
          init();
          $('.scrollspy').scrollSpy();
        });
      }, 0, false);

    });
})();
