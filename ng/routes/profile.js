(function () {
  angular.module('FourApp')
    .controller('Profile', function ($scope, $auth, $stateParams, $timeout,
                                     Toast, Account, Meeting, Comment, User) {
      $scope.comment = '';

      // Get User Profile From the Server
      $scope.get_profile = function () {
        Account.get_profile()
        .then(function (res) {
          $scope.user = res.data;
          $scope.fetch_meetings(res.data._id);
          $scope.fetch_comments(res.data._id);

          // UI
          $timeout(function () {
            $(document).ready(function() {
              // bio text-area initialization
              $('textarea#bio').characterCounter();

              // fix jquery input cancer info textarea
              $('textarea#bio').on('change', function () {
                $scope.user.bio = $(this).val();
                $scope.$apply();
              });

              // fix jquery input cancer comment textarea
              $('textarea#comment').on('change', function () {
                $scope.comment = $(this).val();
                $scope.$apply();
              });

              // sex picker select initialization
              $('#sex').material_select();
              $('#sex').on('change', function () {
                $scope.user.sex = $(this).val();
                $scope.$apply();
              });

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
              $('.datepicker').pickadate('picker').set('select', new Date($scope.user.date));

              // Apply date after picking.
              $('.datepicker').pickadate('picker').on({
                close : function () {
                  var val = $('.datepicker').pickadate('picker').get('value', { format: 'yyyy-mm-dd' });
                  $('.datepicker').blur();
                  $('.picker').blur();
                  if (!val) return ;
                  $scope.user.date = new Date(val);
                }
              });

            });
          }, 0, false);

        });
      };

      // Update User Profile at the Server
      $scope.update_profile = function () {
        Account.update_profile($scope.user)
        .then(function (res) {
          Toast.show_toast('success', 'Вы успешно обновили профиль.');
        })
        .catch(function (res) {
          Toast.show_toast('fail', 'Вы не смогли обновить профиль.');
        });
      };

      $scope.fetch_friend_list = function () {
        User.fetch_friend_list($scope.user._id)
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

      // Fetch User Meetings
      $scope.fetch_meetings = function (owner) {
        Meeting.fetch_meetings(owner)
        .then(function (res) {
          $scope.meetings = res.data;
          // UI
          $timeout(function () {
            $(document).ready(function(){
              // Initialize meetings slider
              $('.slider-meetings').slider({full_width: true, indicators : false, interval : 1, height : 250});
              $('.slider-meetings').slider('pause');
            });
          }, 0, false);

        })
        .catch(function (res) {
          Toast.show_toast('fail', 'Не удалось найти встречи пользователя. ');
        });
      };

      // Fetch User comments
      $scope.fetch_comments = function (user) {
        Comment.fetch_comments(user)
        .then(function (res) {
          $scope.comments = res.data;
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось найти комментарии.');
        });
      };

      // Leave comment
      $scope.leave_comment = function () {
        Comment.leave_comment($scope.user._id, $scope.comment)
        .then(function (res) {
          Toast.show_toast('success', res.data.message || 'Вы успешно оставили комментарий.');
          $scope.comments.push(res.data.comment);
          $scope.comment = '';
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось оставить комментарий.');
        });
      };

      // Link Provider to profile
      $scope.link = function (provider) {
        $auth.link(provider)
        .then(function () {
          Toast.show_toast('success', 'Вы успешно подключили ' + provider);
          self.getProfile();
        })
        .catch(function () {
          Toast.show_toast('fail', 'У Вас не получилось подключить ' + provider);
        });
      };

      // Unlink Provider from profile
      $scope.unlink = function () {
        $auth.unlink(provider)
        .then(function () {
          Toast.show_toast('success', 'Вы успешно отключили ' + provider);
          self.getProfile();
        })
        .catch(function () {
          Toast.show_toast('fail', 'У вас не получилось отключить ' + provider);
        });
      };

      $scope.previous_meeting = function () {
        $('.slider-meetings').slider('prev');
      };

      $scope.next_meeting = function () {
        $('.slider-meetings').slider('next');
      };

      $scope.close_friend_list = function () {
        $('#friendlist-modal').closeModal();
      };

      $scope.get_profile();

    });
})();
