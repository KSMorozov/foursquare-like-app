(function () {
  angular.module('FourApp')
  .controller('MeetingsController', function ($window, $http, $scope, $rootScope) {
    var self  = this;
    self.show = false;

    self.meetings  = [];
    self.owners    = {};
    self.addresses = {};

    $scope.date_filter = new Date();

    self.toggle_map = function () {
      self.show = !self.show;
      return self.show ? init() : (function () {
        self.map.destroy();
        self.map = null;
      })();
    };

    function init () {
      ymaps.ready(function () {
        self.map = new ymaps.Map('map', {
          center: [55.76, 37.64],
          zoom: 11
        });
      });
    }

    angular.element($window).bind('resize', function () {
      if (self.show) self.map.container.fitToViewport();
    });

    self.fetch_nearby_meetings = function () {
      ymaps.ready(function () {
        ymaps.geolocation.get({ provider : 'browser', mapStateAuttoApply : true})
        .then(function (res) {
          var coords = res.geoObjects.get(0).geometry.getCoordinates();
          $http.get('/api/meetings/'+ coords)
          .then(function (res) {
            self.meetings = res.data;
            self.fetch_users();
            self.fetch_addresses();
          })
          .catch(function (res) {
            console.log('Failed to fetch meetings.', res.data.status);
          });
        });
      });
    }

    self.fetch_meetings = function () {
      $http.get('/api/meetings/')
      .then(function (res) {
        self.meetings = res.data;
        self.fetch_users();
        self.fetch_addresses();
      })
      .catch(function (res) {
        console.log('Failed to fetch meetings.', res.data.status);
      });
    };

    self.fetch_addresses = function () {
      ymaps.ready(function () {
        self.meetings.forEach(function (e) {
          ymaps.geocode(e.location, {
            results : 1
          })
          .then(function (res) {
            // console.log(res.geoObjects.get(0).properties.get('name'));
            // console.log(res.geoObjects.get(0).properties.get('text'));
            self.addresses[e.location] = res.geoObjects.get(0).properties.get('text');
            $scope.$apply();
          });
        });
      });
    };

    self.fetch_users = function () {
      self.meetings.forEach(function (e) {
        $http.get('/api/users/' + e.owner)
        .then(function (res) {
          self.owners[e.owner] = res.data;
        })
        .catch(function () {
          console.log('Failed to fetch owner.');
        });
      });
    };

    self.show_onmap = function (loc, address) {
      self.show = true;
      if (self.map === null || typeof self.map === 'undefined') {
        ymaps.ready(function () {
          self.map = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 11
          });
          self.map.geoObjects.add(new ymaps.Placemark(loc, { balloonContent: '<strong>' + address + '</strong>' }));
        });
      } else {
        ymaps.ready(function () {
          self.map.geoObjects.add(new ymaps.Placemark(loc, { balloonContent: '<strong>' + address + '</strong>' }));
        });
      }
    };

    self.add_friend = function (id) {
      $http.post('/api/users/' + id + '/friend')
      .then(function (res) {
        console.log(res.data.message);
      })
      .catch(function (res) {
        console.log(res.data ? res.data.message : 'Failed to Friend', res.status);
      });
    };

    self.fetch_meetings();

    $rootScope.$on('categories_for_meetings', function (event, data) {
      $http.get('/api/meetings/by_category/' + JSON.stringify(data))
      .then(function (res) {
        self.meetings = res.data;
        self.fetch_users();
        self.fetch_addresses();
      })
      .catch(function () {
        console.log('went wrong');
      });
    });
  });
})();
