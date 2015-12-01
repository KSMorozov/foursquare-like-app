(function () {
  angular.module('FourApp', ['ui.router',
                             'satellizer',
                             'ymaps'])
  .run(['$rootScope', '$state', function($rootScope, $state) { $rootScope.$state = $state; }])
  .controller('App', function ($scope) {
    $scope.menu_hover = '';
  });
})();

(function () {
  angular.module('FourApp')
    .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url : '/',
          templateUrl  : 'templates/home.html',
          controller   : 'Home'
        })
        .state('profile', {
          url : '/profile',
          templateUrl  : 'templates/profile.html',
          controller   : 'Profile',
          resolve      : {
            loginRequired: loginRequired
          }
        })
        .state('friends', {
          url : '/friends',
          templateUrl  : 'templates/friends.html',
          controller   : 'Friends',
          resolve      : {
            loginRequired: loginRequired
          }
        })
        .state('user', {
          url : '/user/:id',
          templateUrl : 'templates/user-card.html',
          controller  : 'Single-User',
          resolve     : {
            loginRequired: loginRequired
          }
        })
        .state('chats', {
          url : '/chats',
          templateUrl : 'templates/chats.html',
          controller  : 'Chats',
          resolve     : {
            loginRequired: loginRequired
          }
        })
        .state('chat', {
          url : '/chat/:id',
          templateUrl : 'templates/chat.html',
          controller  : 'Single-Chat',
          resolve     : {
            loginRequired: loginRequired
          }
        })
        .state('login', {
          url : '/login',
          templateUrl  : 'templates/login.html',
          controller   : 'Login',
          resolve      : {
            skipIfLoggedIn: skipIfLoggedIn
          }
        })
        .state('logout', {
          url        : '/logout',
          template   : null,
          controller : 'Logout'
        });


      $urlRouterProvider.otherwise('/');

      $locationProvider.html5Mode(true);

      function skipIfLoggedIn ($q, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
          deferred.reject();
        } else {
          deferred.resolve();
        }
        return deferred.promise;
      }

      function loginRequired($q, $auth, $location) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
          deferred.resolve();
        } else {
          $location.path('/login');
        }
        return deferred.promise;
      }
    });
})();

(function () {
  angular.module('FourApp')
  .config(function ($authProvider) {

    $authProvider.facebook({
      clientId : '305477006289361'
    });

    $authProvider.google({
      clientId: '42870382961-ek19j7acg6r4si9jk64t6r8ldhv9fd9h.apps.googleusercontent.com'
    });

    $authProvider.instagram({
      clientId: '341513eb021e489ba24275dde6c4ac04'
    });

    $authProvider.twitter({
      url: '/auth/twitter'
    });

  });
})();

(function () {
  angular.module('FourApp')
    .controller('MainNavigation', function ($scope, $auth) {
      $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
      };
    });
})();

(function () {
  angular.module('FourApp')
    .controller('Chats', function ($scope, Chat) {
      $scope.fetch_chats = function () {
        Chat.fetch_chats()
        .then(function (res) {
          $scope.chats = res.data;
          console.log(res.data);
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не получилось найти сообщения.');
        });
      };

      $scope.fetch_chats();
    });
})();

(function () {
  angular.module('FourApp')
    .controller('Friends', function ($scope, $auth, Toast, Account) {
      $scope.get_friends = function () {
        Account.get_friends()
        .then(function (res) {
          $scope.friends = res.data;
        })
        .catch(function (res) {
          Toast.show_toast('fail', 'Мы не смогли найти ваших друзей.');
        });
      };

      $scope.get_friends();
    });
})();

(function () {
  angular.module('FourApp')
    .controller('Login', function ($scope, $auth, $state, Toast) {

      function close_modal() {
        $timeout(function () {
          $('#login-modal').closeModal();
        }, 0, false);
      }

      // Signup Action
      $scope.signup = function () {
        $auth.signup($scope.user)
        .then(function (res) {
          $auth.setToken(res);
          close_modal();
          $state.go('home');
          Toast.show_toast('success', 'Вы Успешно зарегистрировались');
        })
        .catch(function (res) {
          close_modal();
          $state.go($state.current, {}, {reload: true});
          Toast.show_toast('fail', 'Вы не смогли зарегистрироваться');
        });
      };

      // Signin Action
      $scope.signin = function () {
        $auth.login($scope.user)
        .then(function (res) {
          close_modal();
          $state.go('home');
          Toast.show_toast('success', 'Вы Успешно вошли');
        })
        .catch(function (res) {
          close_modal();
          $state.go($state.current, {}, {reload: true});
          Toast.show_toast('fail', 'Вы не смогли войти');
        });
      };

      $scope.authenticate = function (provider) {
        $auth.authenticate(provider)
        .then(function () {
          close_modal();
          $state.go('home');
          Toast.show_toast('success', 'Вы Успешно вошли');
        })
        .catch(function () {
          close_modal();
          $state.go($state.current, {}, {reload: true});
          Toast.show_toast('fail', 'Вы не смогли войти');
        });
      };

      // Open Login Modal.
      $(document).ready(function () {
        $('#login-modal').openModal({
            dismissible: false,
            opacity: .5, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
            ready: function() { $('ul.tabs').tabs(); }, // Callback for Modal open
            complete: function() {  } // Callback for Modal close
          }
        );
      });

    });
})();

(function () {
  angular.module('FourApp')
    .controller('Logout', function ($scope, $auth, $state, Toast) {
      if (!$auth.isAuthenticated) return;
      $auth.logout()
      .then(function () {
        Toast.show_toast('success', 'Вы успешно вышли');
        $state.go('login');
      });
    });
})();

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
              $('.slider-meetings').slider({full_width: true, indicators : false, interval : 1, height : 200});
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

(function () {
  angular.module('FourApp')
    .controller('Single-Chat', function ($scope, $stateParams, Chat, Toast) {
      var message = '';

      var user   = $stateParams.id;
      var amount = 20;
      var skip   = 0;

      $scope.fetch_chat = function (user, amount, skip) {
        Chat.fetch_chat(user, amount, skip)
        .then(function (res) {
          $scope.chat = res.data;
          console.log(res.data);
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось получить сообщения.');
          console.log(res.data);
        });
      };

      $scope.send_message = function () {
        console.log($scope.message);
        Chat.send_message($stateParams.id, $scope.message)
        .then(function (res) {
          $scope.chat.push(res.data);
          console.log(res.data);
          $scope.message = '';
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось отправить сообщение.');
        });
      };

      $scope.fetch_chat(user, amount, skip);
    });
})();

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

angular.module('FourApp')
  .factory('Account', function ($http) {
    return {
      get_profile : function () {
        return $http.get('/api/me');
      },
      update_profile : function (profile_data) {
        return $http.put('/api/me', profile_data);
      },
      get_friends : function () {
        return $http.get('/api/me/friends');
      }
    }
  });

angular.module('FourApp')
  .factory('Chat', function ($http) {
    return {
      fetch_chats : function () {
        return $http.get('/api/messages/chats');
      },
      fetch_chat : function (user, amount, skip) {
        return $http.get('/api/messages/chat', { params : { user : user, amount : amount, skip : skip } });
      },
      send_message : function (user, body) {
        return $http.post('/api/messages', { user : user, body : body });
      }
    }
  });

(function () {
  angular.module('FourApp')
    .factory('Comment', function ($http) {
      return {
        leave_comment : function (thing, body) {
          return $http.post('/api/comments', { thing : thing, body : body });
        },
        fetch_comments : function (thing) {
          return $http.get('/api/comments', { params : { thing : thing } });
        }
      };
    });
})();

angular.module('FourApp')
  .factory('Meeting', function ($http) {
    return {
      fetch_meetings : function (user) {
        return $http.get('/api/meetings/owner', { params : { owner : user } });
      }
    }
  });

(function () {
  angular.module('FourApp')
  .factory('Toast', function () {

    return {
      show_toast : function (type, msg) {
        Materialize.toast('<span>' + msg + '</span>', 3000);
        $(document).ready(function () { $('#toast-container .toast').addClass(type); });
      }
    };

  });
})();

angular.module('FourApp')
  .factory('User', function ($http) {
    return {
      fetch_user : function (id) {
        return $http.get('/api/users/' + id);
      },
      follow_user : function (id) {
        return $http.post('/api/users/friend', { id : id });
      },
      fetch_friend_list : function (id) {
        return $http.get('/api/users/friends', { params : { id : id } });
      }
    }
  });
