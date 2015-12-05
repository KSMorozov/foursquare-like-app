(function () {
  angular.module('FourApp')
    .controller('NewMeeting', function ($scope, $state, $timeout, $rootScope,
                                        Category, Toast, Meeting) {
      var self = this;
      $scope.choice = '';
      $scope.address = '';
      $scope.meeting = {
        tags : [],
        categories : []
      };

      self.fetch_categories = function () {
        Category.fetch_categories()
        .then(function (res) {
          $scope.categories = res.data;
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось получить категории');
        });
      };

      $scope.select_category = function (name) {
        $scope.category_selected = name;
      };

      $scope.is_selected_category = function (name) {
        return $scope.category_selected === name;
      };

      $scope.is_checked_tag = function (name) {
        return $scope.meeting.tags.indexOf(name) > -1;
      };

      $scope.check_tag = function (name, category) {
        var idx = $scope.meeting.tags.indexOf(name);
        if (idx > -1) {
          $scope.meeting.tags.splice(idx, 1);
        } else $scope.meeting.tags.push(name);

        idx = $scope.meeting.categories.indexOf(category);

        var category_index;
        $scope.categories.forEach(function (e, i) {if (e.name === category) {category_index = i;}});
        var gone = true;
        $scope.meeting.tags.forEach(function (e) {if ($scope.categories[category_index].tags.indexOf(e) > -1) gone = false;});
        if (gone) $scope.meeting.categories.splice(idx, 1);
        else if ($scope.meeting.categories.indexOf(category) === -1) $scope.meeting.categories.push(category);
      };

      $scope.set_nearby = function () {
        $scope.choice = 'nearby'
        // clean map
        $rootScope.map.geoObjects.removeAll();

        // get user coords
        $rootScope.geolocation.get({
          provider : 'browser',
          mapStateAutoApply: true
        }).then(function (res) {
          var coordinates = res.geoObjects.get(0).geometry.getCoordinates()

          // place mark on map
          $rootScope.map.geoObjects.add(new ymaps.Placemark(coordinates, {
              balloonContent: '<span class="grey-text text-darken-4 light-text" style="font-size:11px;"><strong>' + $scope.meeting.title +'</strong></span>'
          }, {
              preset: 'islands#dotIcon',
              iconColor: 'orange'
          }));

          // dank animation
          $rootScope.map.panTo(coordinates, { duration : 500 })
          .then(function () {
            $rootScope.map.setCenter(coordinates, 10, { duration : 450 });
          });

          // apply new coordinates to meeting
          $scope.meeting.place = coordinates;
        });
      };

      $scope.set_address = function () {
        $scope.choice = 'address';

        // Add Address input watcher
        $scope.$watch(function () {
          return $scope.address;
        }, function (new_value, old_value) {
          if (!new_value || new_value === old_value) return;
          // Find Described Address
          ymaps.geocode(new_value, {
            results : 1
          }).then(function (res) {
            var coordinates = res.geoObjects.get(0).geometry.getCoordinates();

            // Clean map.
            $rootScope.map.geoObjects.removeAll();

            // place mark on map
            $rootScope.map.geoObjects.add(new ymaps.Placemark(coordinates, {
              balloonContent : '<span class="grey-text text-darken-4 light-text" style="font-size:11px;"><strong>' + $scope.meeting.title +'</strong></span>'
            }, {
              preset: 'islands#dotIcon',
              iconColor: 'orange'
            }));

            // dank animation
            $rootScope.map.panTo(coordinates, { duration : 500 })
            .then(function () {
              $rootScope.map.setCenter(coordinates, 10, { duration : 450 });
            });

            // apply new coordinates to meeting
            $scope.meeting.place = coordinates;
          });
        });
      }

      $scope.set_onmap = function () {
        $scope.choice = 'onmap'
        // clean map
        $rootScope.map.geoObjects.removeAll();

        // get user coords
        $rootScope.geolocation.get({
          provider : 'browser',
          mapStateAutoApply: true
        }).then(function (res) {
          var coordinates = res.geoObjects.get(0).geometry.getCoordinates()

          // Create new mark at user location.
          var mark = new ymaps.Placemark(coordinates, {
              balloonContent: '<span class="grey-text text-darken-4 light-text" style="font-size:11px;"><strong>' + $scope.meeting.title +'</strong></span>'
          }, {
              draggable : true,
              preset: 'islands#dotIcon',
              iconColor: 'orange'
          });

          // add drag event to mark
          mark.events.add('drag', function (e) {
            var coordinates = mark.geometry.getCoordinates();

            // dank animation
            $rootScope.map.panTo(coordinates, { duration : 500 })
            .then(function () {
              $rootScope.map.setCenter(coordinates, 10, { duration : 450 });
            });

            // apply new coordinates to meeting
            $scope.meeting.place = coordinates;
          });

          // place mark on map
          $rootScope.map.geoObjects.add(mark);
        });
      };

      $scope.set_anywhere = function () {
        $scope.choice = 'onmap';
        $scope.meeting.place = undefined;
      }

      $scope.new_meeting = function () {
        var meeting = $scope.meeting
        $scope.meeting = {
          tags : [],
          categories : []
        };
        Meeting.new_meeting(meeting)
        .then(function (res) {
          Toast.show_toast('success', 'Вы успешно создали встречу.');
          $state.go('meeting', { id : res.data.id });
        })
        .catch(function (res) {
          Toast.show_toast('fail', 'У вас не получилось создать встречу.');
        });
      };

      $scope.$watch(function () {
        return $scope.meeting;
      }, function (new_value, old_value) {
        if (!new_value || new_value === old_value) return;
        $scope.valid = !!new_value.title && !!new_value.date && !!new_value.private
          && !!new_value.place && !!new_value.event_name && !!new_value.description;
      }, true);

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

          // date translate
          // $('.datepicker').pickadate('picker').set('select', new Date($scope.meeting.date));

          // Apply date after picking.
          $('.datepicker').pickadate('picker').on({
            close : function () {
              var val = $('.datepicker').pickadate('picker').get('value', { format: 'yyyy-mm-dd' });
              $('.datepicker').blur();
              $('.picker').blur();
              if (!val) return ;
              $scope.meeting.date = new Date(val);
            }
          });

          // Initialize private option select
          $('select#private').material_select();
          $('select#private').on('change', function () {
            $scope.meeting.private = $(this).val();
            $scope.$apply();
          });

          // Initialize Description textarea
          $('textarea#description').on('change', function () {
            $scope.meeting.description = $(this).val();
            $scope.$apply();
          });

        });
      }, 0, false);

      self.fetch_categories();

    });
})();
