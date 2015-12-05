(function () {
  angular.module('FourApp')
    .controller('MyMeetings', function ($window, $scope, $rootScope,
                                        Toast, Account, Meeting) {
      var self = this;

      self.fetch_user = function () {
        Account.get_profile()
        .then(function (res) {
          $scope.user = res.data;
          self.fetch_meetings(res.data._id);
        })
        .catch(function (res) {
          Toast.show_toast('fail', 'Не удалось найти ваш аккаунт.');
        });
      };

      self.fetch_meetings = function (user) {
        Meeting.fetch_meetings(user)
        .then(function (res) {
          $scope.meetings = res.data;
        })
        .catch(function (res) {
          Toast.show_toast('fail', 'Не удалось найти ваши встречи.');
        });
      };

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

      $scope.cancel_meeting = function (id) {
        Meeting.cancel_meeting(id)
        .then(function (res) {
          Toast.show_toast('success', res.data.message || 'Вы успешно отменили встречу.');
          self.fetch_meetings($scope.user._id);
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось отменить встречу.');
        });
      };

      self.fetch_user();
    });
})();
