(function () {
  angular.module('FourApp', ['ui.router',
                             'satellizer',
                             'ymaps'])
  .run(['$rootScope', '$state', function($rootScope, $state) { $rootScope.$state = $state; }]);
})();

(function () {
  angular.module('FourApp')
    .controller('App', function ($scope, $rootScope, $timeout) {
      $scope.menu_hover = '';

      function init () {
        ymaps.ready(function () {
          $rootScope.geolocation = ymaps.geolocation;
          $rootScope.map = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 8,
            controls : []
          }, {
            searchControlProvider: 'yandex#search'
          });

          // discover user location
          ymaps.geolocation.get({
            provider : 'browser',
            mapStateAutoApply: true
          }).then(function (res) {
            $rootScope.user_city = res.geoObjects.get(0).properties.get('text').split(', ')[1];

            // get coordinates of the city center user located in
            ymaps.geocode($rootScope.user_city, {
              results : 1
            }).then(function (res) {
              $rootScope.user_coordinates = res.geoObjects.get(0).geometry.getCoordinates();

              $rootScope.$emit('discovered_location', {
                city : $rootScope.user_city,
                coordinates : $rootScope.user_coordinates
              });
            });

          });
        });
      }

      $timeout(function () {
        $(document).ready(function(){
          init();
          $('.scrollspy').scrollSpy();
        });
      }, 0, false);

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
        .state('my-meetings', {
          url : '/my-meetings',
          templateUrl : 'templates/my-meetings.html',
          controller  : 'MyMeetings',
          resolve     : {
            loginRequired: loginRequired
          }
        })
        .state('meetings', {
          url : '/meetings',
          templateUrl : 'templates/meetings.html',
          controller  : 'Meetings',
          resolve     : {
            loginRequired: loginRequired
          }
        })
        .state('new-meeting', {
          url : '/new-meetings',
          templateUrl : 'templates/new-meeting.html',
          controller  : 'NewMeeting',
          resolve     : {
            loginRequired: loginRequired
          }
        })
        .state('meeting', {
          url : '/meeting/:id',
          templateUrl : 'templates/meeting.html',
          controller  : 'Single-Meeting',
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
    .controller('Tags', function ($scope, $rootScope, $timeout, Category) {
      $scope.meeting = {
        tags : [],
        categories : []
      };

      function close_modal() {
        $timeout(function () {
          $('#tags-modal').closeModal();
        }, 0, false);
      }

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

      $scope.apply_tags = function (apply) {
        close_modal();
        if (!apply) return;

        // apply_categories_tags
        $rootScope.$emit('apply_categories_tags', {
          tags : $scope.meeting.tags,
          categories : $scope.meeting.categories
        });

        $scope.meeting = {
          tags : [],
          categories : []
        };
      };

      // watching tags
      // $scope.$watch(function () {
      //   return [$scope.meeting.tags, $scope.meeting.categories];
      // }, function (new_value, old_value) {
      //   if (!new_value[0] || !new_value[1]) return ;
      //   $rootScope.$emit('apply_categories_tags', {
      //     tags : new_value[0],
      //     categories : new_value[1]
      //   });
      // });

      self.fetch_categories();
    });
})();

(function () {
  angular.module('FourApp')
    .controller('MainNavigation', function ($scope, $auth, $rootScope) {
      $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
      };

      // add event to listen to location change from rootScope
      $rootScope.$on('discovered_location', function (event, user) {
        $scope.user_city = user.city;
        $scope.$apply();
      });
    });
})();

(function () {
  angular.module('FourApp')
    .controller('RightNavigation', function ($scope, $rootScope, $timeout) {

      $rootScope.$on('apply_categories_tags', function (event, data) {
        $scope.categories = data.categories;
      });

      $scope.open_tags_picker = function () {
        // Open Login Modal.
        $timeout(function () {
          $(document).ready(function () {
            $('#tags-modal').openModal({
                dismissible: true,
                opacity: .5, // Opacity of modal background
                in_duration: 300, // Transition in duration
                out_duration: 200, // Transition out duration
                ready: function() {  }, // Callback for Modal open
                complete: function() {  } // Callback for Modal close
              }
            );
          });
        }, 0, false);
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

(function () {
  angular.module('FourApp')
    .controller('MyMeetings', function ($window, $scope, $rootScope,
                                        Toast, Account, Meeting, User) {
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

      $scope.fetch_friend_list = function () {
        User.fetch_friend_list($scope.user._id)
        .then(function (res) {
          $scope.friends = res.data;
          $scope.selected_friends = [];
          console.log($scope.friends);
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

      $scope.select_friend = function (id) {
        console.log(id);
        var idx = $scope.selected_friends.indexOf(id);
        if (idx > -1) $scope.selected_friends.splice(id, 1);
        else $scope.selected_friends.push(id);
      };

      $scope.is_checked_friend = function (id) {
        return $scope.selected_friends.indexOf(id) > -1;
      };

      $scope.send_invites = function () {

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

(function () {
  angular.module('FourApp')
    .controller('Single-Chat', function ($scope, $stateParams, Chat, Toast, Invite) {
      var message = '';
      $scope.show = false;

      var user   = $stateParams.id;
      var amount = 20;
      var skip   = 0;

      $scope.fetch_chat = function (user, amount, skip) {
        Chat.fetch_chat(user, amount, skip)
        .then(function (res) {
          $scope.chat = res.data;
          $scope.show = true;
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось получить сообщения.');
          $scope.show = true;
        });
      };

      $scope.fetch_invites = function (user) {
        Invite.fetch_invites(user)
        .then(function (res) {
          console.log(res);
          $scope.invites = res.data.invites;
        })
        .catch(function (res) {
          console.log(res);
        });
      };

      $scope.send_message = function () {
        Chat.send_message($stateParams.id, $scope.message)
        .then(function (res) {
          $scope.chat.push(res.data);
          Toast.show_toast('success', res.data.message || 'Успешно отправили сообщение.');
          $scope.message = '';
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось отправить сообщение.');
        });
      };

      $scope.fetch_chat(user, amount, skip);
      $scope.fetch_invites($stateParams.id);
    });
})();

(function () {
  angular.module('FourApp')
    .controller('Single-Meeting', function ($scope, $stateParams, Toast) {
      $scope.id = $stateParams.id;
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
          console.log(res.data);
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
  .factory('Category', function ($http) {
    return {
      fetch_categories : function () {
        return $http.get('/utils/categories');
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
  .factory('Invite', function ($http) {
    return {
      fetch_invites : function (addresser) {
        return $http.get('/api/invites', { params : { addresser : addresser } });
      }
    }
  });

angular.module('FourApp')
  .factory('Meeting', function ($http) {
    return {
      fetch_meetings : function (user) {
        return $http.get('/api/meetings/owner', { params : { owner : user } });
      },
      new_meeting : function (meeting) {
        return $http.post('/api/meetings/', meeting);
      },
      fetch_meetings_filters : function (filters) {
        return $http.get('/api/meetings/', { params : filters });
      },
      cancel_meeting : function (id) {
        return $http.delete('/api/meetings/delete', { params : { id : id } });
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
