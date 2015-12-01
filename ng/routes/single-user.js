(function () {
  angular.module('FourApp')
    .controller('Single-User', function ($scope, $stateParams, $timeout, Toast,
                                         User, Meeting, Comment) {
      $scope.comment = '';

      // fetch user profile info
      $scope.fetch_user = function () {
        User.fetch_user($stateParams.id)
        .then(function (res) {
          $scope.user = res.data;

          // UI
          $timeout(function () {
            $(document).ready(function(){
              // Initialize meetings slider
              $('.slider-meetings').slider({full_width: true, indicators : false, interval : 1, height : 200});
              $('.slider-meetings').slider('pause');

              // fix jquery input cancer comment textarea
              $('textarea#comment').on('change', function () {
                $scope.comment = $(this).val();
                $scope.$apply();
              });
            });
          }, 0, false);

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

      $scope.fetch_friend_list = function () {
        User.fetch_friend_list($stateParams.id)
        .then(function (res) {
          $scope.friends = res.data;
          $(document).ready(function () {
            $('#friendlist-modal').openModal({
                dismissible: true,
                opacity: .5, // Opacity of modal background
                in_duration: 300, // Transition in duration
                out_duration: 200, // Transition out duration
                ready: function() {  }, // Callback for Modal open
                complete: function() {  } // Callback for Modal close
              }
            );
          });
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось найти друзей пользователя.');
        });
      };

      // fetch user's meetings
      $scope.fetch_meetings = function () {
        Meeting.fetch_meetings($stateParams.id)
        .then(function (res) {
          $scope.meetings = res.data;

          // UI
          $timeout(function () {
            $(document).ready(function(){
              $('.slider-meetings').slider({full_width: true, indicators : false, interval : 1, height : 200});
              $('.slider-meetings').slider('pause');
              // Initialize meetings slider
              // fix jquery input cancer comment textarea
              $('textarea#comment').on('change', function () {
                $scope.comment = $(this).val();
                $scope.$apply();
              });
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
        $timeout(function () {
          $('.slider-meetings').slider('prev');
        }, 0, false);
      };

      $scope.next_meeting = function () {
        $timeout(function () {
          $('.slider-meetings').slider('next');
        }, 0, false);
      };

      $scope.close_friend_list = function () {
        $('#friendlist-modal').closeModal();
      };

      $scope.fetch_user();
      $scope.fetch_meetings();
      $scope.fetch_comments();
    });
})();
