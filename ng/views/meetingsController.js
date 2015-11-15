(function () {
  angular.module('FourApp')
  .controller('MeetingsController', function ($window, $http, $scope, $rootScope, Toast, Meeting, $mdDialog) {
    var self  = this;

    self.show = false;
    $scope.meetings = [];
    $scope.addresses = [];

    $scope.location = $rootScope.user_city_coords;

    $scope.date_filter;

    $scope.show_invites = function (ev, id) {
      var meeting_id = id;

      $mdDialog.show({
        controller   : 'InvitesDialog',
        controllerAs : 'Invites',
        templateUrl  : 'templates/invites.dialog.html',
        parent       : angular.element(document.body),
        targetEvent  : ev,
        locals       : {
          meeting_id : meeting_id
        },
        clickOutsideToClose : true
      })
      .then(function () {

      }, function () {

      });

    };

    $scope.underground_station  = '';
    $scope.underground_stations = [{ name : 'Бульвар Рокоссовского' },
                                   { name : 'Авиамоторная' },
                                   { name : 'Первомайская' },
                                   { name : 'Щелковская'}];

    $scope.filters = {
      location_filter : $scope.location
    };

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

    self.fetch_meetings = function (filters) {
      console.log(filters);
      Meeting.fetch_meetings(filters)
      .then(function (res) {
        if(!res.data.length) Toast.show_toast('failed', 'Отсутствуют Встречи по заданным критериям.');
        $scope.meetings = res.data;
        console.log($scope.meetings);
      });
    };

    $scope.fetch_address = function (coords, index) {
      if (!coords) return;
      ymaps.ready(function () {
        ymaps.geocode(coords, {
          results : 1
        })
        .then(function (res) {
          // console.log(res.geoObjects.get(0).properties.get('name'));
          // console.log(res.geoObjects.get(0).properties.get('text'));
          $scope.addresses[index] = res.geoObjects.get(0).properties.get('text');
          $scope.$apply();
        })
        .catch(function () {
          $scope.addresses[index] = '';
          $scope.$apply();
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

    $scope.add_friend = function (id) {
      console.log('hey', id);
      $http.post('/api/users/' + id + '/friend')
      .then(function (res) {
        console.log(res.data.message);
      })
      .catch(function (res) {
        console.log(res.data ? res.data.message : 'Failed to Friend', res.status);
      });
    };

    $scope.attend_meeting = function (id) {
      Meeting.attend_meeting(id)
      .then(function (res) {
        Toast.show_toast('success', res.data.message);
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.status === 304 ? 'Вы уже откликнулись на эту встречу ранее.' : 'Произошла ошибка :(.');
      });
    };

    self.apply_nearby = function () {
      ymaps.ready(function () {
        ymaps.geolocation.get({ provider : 'browser' })
        .then(function (res) {
          var coords = res.geoObjects.get(0).geometry.getCoordinates();
          $scope.location = coords;
          $scope.$apply();
        });
      });
    };

    $rootScope.$on('apply_tags', function (event, data) {
      $scope.filters.tags_filter = data.tags;
    });

    $rootScope.$on('city_change', function (event, data) {
      $scope.location = data;
      $scope.$apply();
    });

    $scope.$watch(function () { return $scope.date_filter }, function (new_value, old_value) {
      if (!new_value || +new_value === +old_value) return;
      $scope.filters.date_filter = new Date(new_value);
    });

    $scope.$watch(function () { return $scope.underground_station }, function (new_value, old_value) {
      if (!new_value || new_value === old_value) return;
      ymaps.ready(function () {
        ymaps.geocode($rootScope.user_city + ' метро ' + new_value, {
          results : 1
        })
        .then(function (res) {
          var coords = res.geoObjects.get(0).geometry.getCoordinates();
          $scope.location = coords;
          $scope.$apply();
        })
      });
    });

    $scope.$watch(function () { return $scope.location }, function (new_value, old_value) {
      if(!new_value || new_value === old_value) return;
      $scope.filters.location_filter = new_value;
    });

    $scope.$watch(function () { return $scope.filters }, function (new_value, old_value) {
      if (!new_value || new_value === old_value) return;
      self.fetch_meetings(new_value);
    }, true)

    angular.element($window).bind('resize', function () {
      if (self.show) self.map.container.fitToViewport();
    });

    self.fetch_meetings($scope.filters);
  });
})();
