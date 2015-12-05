(function () {
  angular.module('FourApp')
    .controller('Meetings', function ($window, $scope, $rootScope, $timeout, Toast, Meeting) {

      $scope.filters = {};
      $scope.user_city = $rootScope.user_city;
      $scope.user_coordinates = $rootScope.user_coordinates;
      $scope.filters.location_type = 'city';

      $rootScope.$on('discovered_location', function (event, user) {
        $scope.user_city = user.city;
        $scope.user_coordinates = user.coordinates;
        $scope.filters.location_type = 'city';
        $scope.$apply();
      });


      $rootScope.$on('apply_categories_tags', function (event, data) {
        $scope.tags = data.tags;
      });

      $scope.fetch_meetings = function () {
        Meeting.fetch_meetings_filters($scope.filters)
        .then(function (res) {
          $scope.meetings = res.data;
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось получить встречи.');
        });
      };

      // watching coordinates
      $scope.$watch(function () {
        return $scope.user_coordinates;
      }, function (new_value, old_value) {
        if (!new_value || new_value === old_value) return ;
        $scope.filters.location = new_value;
        $scope.fetch_meetings();
      });

      // watching date
      $scope.$watch(function () {
        return $scope.date;
      }, function (new_value, old_value) {
        if (!new_value || new_value === old_value) return ;
        $scope.filters.date = new_value;
        $scope.fetch_meetings();
      });

      // watching tags
      $scope.$watch(function () {
        return $scope.tags;
      }, function (new_value, old_value) {
        if (!new_value) return ;
        $scope.filters.tags = new_value;
        $scope.fetch_meetings();
      });

      $scope.show_on_map = function (coordinates, title) {
        $window.scrollTo(0, 0);
        $rootScope.map.geoObjects.removeAll();
        $rootScope.map.geoObjects.add(new ymaps.Placemark(coordinates, {
            balloonContent: '<span class="grey-text text-darken-4 light-text" style="font-size:11px;"><strong>' + title +'</strong></span>'
        }, {
            preset: 'islands#dotIcon',
            iconColor: 'orange'
        }));
        $rootScope.map.panTo(coordinates, { duration : 500 })
        .then(function () {
          $rootScope.map.setCenter(coordinates, 10, {duration : 450 });
        });
      };

      // UI
      $timeout(function () {
        $(document).ready(function() {
          // datepicker initialization
          $('.datepicker').pickadate({
            monthsFull: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Ию', 'Ию', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек'],
            weekdaysFull: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            today: 'Сегодня',
            clear: '',
            close: 'Закрыть',
            firstDay: 'Понедельник',
            format: 'yyyy/mm/dd',
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
          });

          // Apply date after picking.
          $('.datepicker').pickadate('picker').on({
            close : function () {
              var val = $('.datepicker').pickadate('picker').get('value', { format: 'yyyy-mm-dd' });
              $('.datepicker').blur();
              $('.picker').blur();
              if (!val) return ;
              $scope.date = new Date(val);
              $scope.$apply();
            }
          });

          // Initialize private option select
          $('select#metro').material_select();
          $('select#metro').on('change', function () {
            $scope.metro = $(this).val();
            $scope.$apply();
            // acquire coordinates of metro with yandex set coordinates according results;
            ymaps.ready(function () {
              ymaps.geocode($rootScope.user_city + ' метро ' + $scope.metro, {
                results : 1
              })
              .then(function (res) {
                var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
                $scope.user_coordinates = coordinates;
                $scope.filters.location_type = 'metro';
                $scope.$apply();
              });
            });
          });

        });
      }, 0, false);

      $scope.fetch_meetings();
    });
})();
