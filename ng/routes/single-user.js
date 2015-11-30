(function () {
  angular.module('FourApp')
    .controller('Single-User', function ($scope, $stateParams, $timeout, Toast, User, Meeting, Comment) {
      $scope.comment = '';

      // fetch user profile info
      $scope.fetch_user = function () {
        User.fetch_user($stateParams.id)
        .then(function (res) {
          $scope.user = res.data;
        })
        .catch(function (res) {
          Toast.show_toast('fail', 'Мы не смогли найти пользователя.');
        });
      };

      // follow user
      $scope.follow_user = function () {
        User.follow_user($stateParams.id)
        .then(function (res) {
          Toast.show_toast('success', res.data.message);
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message);
        });
      };

      // fetch user's meetings
      $scope.fetch_owner_meetings = function () {
        Meeting.fetch_owner_meetings($stateParams.id)
        .then(function (res) {
          $scope.meetings = res.data;

          // UI
          // Initialize meetings slider
          $timeout(function () {
            $(document).ready(function(){
              $('.slider-meetings').slider({full_width: true, indicators : false, interval : 1, height : 200});
              $('.slider-meetings').slider('pause');
            });
          }, 0, false);

        })
        .catch(function (res) {
          Toast.show_toast('fail', 'Не удалось найти встречи пользователя. ');
        });
      };

      $scope.fetch_comments = function () {
        Comment.fetch_comments($stateParams.id)
        .then(function (res) {
          $scope.comments = res.data;
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось найти комментарии.');
        });
      };

      $scope.leave_comment = function () {
        console.log(typeof $scope.comment);
        Comment.leave_comment($stateParams.id, $scope.comment)
        .then(function (res) {
          Toast.show_toast('success', res.data.message || 'Вы успешно оставили комментарий.');
          $scope.comments.push(res.data.comment);
          $scope.comment = '';
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось оставить комментарий.');
        });
      };

      $scope.previous_meeting = function () {
        $('.slider-meetings').slider('prev');
      };

      $scope.next_meeting = function () {
        $('.slider-meetings').slider('next');
      };

      $scope.fetch_owner_meetings();
      $scope.fetch_user();
      $scope.fetch_comments();
    });
})();
