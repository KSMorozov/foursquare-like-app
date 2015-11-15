(function () {
  angular.module('FourApp')
  .controller('MeetingController', function ($scope, $stateParams, Meeting, Comment, Toast, $mdDialog) {
    var self = this;
    self.show = false;
    $scope.address = '';

    $scope.show_invites = function (ev) {
      var meeting_id = $scope.meeting._id;

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

    $scope.toggle_map = function () {
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

    self.show_onmap = function () {
      var loc = $scope.meeting.place;
      var address = $scope.address;
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

    $scope.fetch_address = function (coords) {
      console.log(coords);
      if (!coords) return;
      ymaps.ready(function () {
        ymaps.geocode(coords, {
          results : 1
        })
        .then(function (res) {
          $scope.address = res.geoObjects.get(0).properties.get('text');
          $scope.$apply();
        })
        .catch(function () {
          $scope.address = '';
          $scope.$apply();
        });
      });
    };

    $scope.fetch_meeting = function (id) {
      Meeting.fetch_meeting(id)
      .then(function (res) {
        $scope.meeting = res.data;
        $scope.fetch_address($scope.meeting.place);
        console.log(res.data);
      });
    };

    $scope.send_comment = function () {
      var comment = {
        body : $scope.comment,
        to   : $scope.meeting._id
      };
      Comment.send_comment(comment)
      .then(function (res) {
        Toast.show_toast('success', res.data.message);
        $scope.comment = '';
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.data.message);
        $scope.comment = '';
      });
    };

    $scope.fetch_comments = function (meeting_id) {
      Comment.fetch_comments(meeting_id)
      .then(function (res) {
        $scope.comments = res.data;
        console.log($scope.comments);
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.data.message);
      });
    };

    $scope.attend_meeting = function () {
      Meeting.attend_meeting($scope.meeting._id)
      .then(function (res) {
        Toast.show_toast('success', res.data.message);
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.status === 304 ? 'Вы уже откликнулись на эту встречу ранее.' : 'Произошла ошибка :(.');
      });
    };

    $scope.fetch_comments($stateParams.id);
    $scope.fetch_meeting($stateParams.id);
  });
})();
