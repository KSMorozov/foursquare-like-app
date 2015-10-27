(function () {
  angular.module('FourApp', ['ngMaterial',
                             'ui.router',
                             'satellizer',
                             'ymaps'])
  .run(['$rootScope', '$state', function($rootScope, $state) { $rootScope.$state = $state; }]);
})();

(function () {
  angular.module('FourApp')
  .factory('Account', function ($http) {
    return {
      getProfile : function () {
        return $http.get('/api/me');
      },
      updateProfile : function (profileData) {
        return $http.put('/api/me', profileData);
      }
    };
  });
})();

(function () {
  angular.module('FourApp')
  .controller('ApplicationController', function () {
    var self = this;
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
  .controller('ChatController', function ($stateParams, $http, Account) {
    var self = this;

    self.comb     = [];
    self.messages = [];
    self.me       = {};
    self.friend   = {};

    self.is_friend    = function (id) {
      return id === $stateParams.id;
    };

    self.get_yourself = function () {
      Account.getProfile()
      .then(function (res) {
        self.me = res.data;
        console.log(self.me);
      });
    };

    self.get_friend   = function () {
      $http.get('/api/users/' + $stateParams.id)
      .then(function (res) {
        self.friend = res.data;
        console.log(self.friend);
      });
    };

    self.get_messages = function () {
      $http.post('/api/messages/chats', {
        friend : $stateParams.id
      })
      .then(function (res) {
        self.messages = res.data;
        console.log(self.messages);
      });
    };

    self.send_message = function () {
      $http.post('/api/messages', {
        user_id : $stateParams.id, body : self.message
      })
      .then(function (res) {
        self.message = '';
        console.log(res.data);
      })
      .catch(function (res) {
        console.log(res.status);
      });
    };

    self.up   = function (e) { self.comb.push(e.keyCode) };

    self.down = function (e) { self.comb = []; self.comb.push(e.keyCode) };

    self.check = function () {
      if (self.comb.join('').split(0, 4) == '1391') self.send_message();
    };

    self.get_messages();
    self.get_yourself();
    self.get_friend();
  });
})();

(function () {
  angular.module('FourApp')
  .controller('ChatsController', function ($http, Account) {
    var self = this;

    self.chats = [];

    self.get_chats = function () {
      Account.getProfile()
      .then(function (res) {
        res.data.friends.forEach(function (id) {
          $http.post('/api/messages/chats', {
            friend : id,
            amount : 1
          })
          .then(function (res) {
            console.log(res.data);
            $http.get('/api/users/' + id)
            .then(function (response) {
              self.chats.push({
                friend_id   : id,
                displayName : response.data.displayName,
                picture     : response.data.picture,
                message     : res.data[0].body
              });
            });
          });
        });
      });
    };

    self.get_chats();
  });
})();

(function () {
  angular.module('FourApp')
  .controller('NewMeetingController', function ($http, $window, $scope) {
    var self  = this;
    $scope.map = {
      center : [55.76, 37.64],
      zoom   : 11,
      show   : false,
      spot   : null
    };

    self.categories = {
      movies : {
        name : 'Кино',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      food : {
        name : 'Еда',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      sports : {
        name : 'Спорт',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      arts : {
        name : 'Творчество',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      eco : {
        name : 'Природа',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      dance : {
        name : 'Танцы',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      music : {
        name : 'Музыка',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      cars : {
        name : 'Транспорт',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      theatre : {
        name : 'Театр',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      it : {
        name : 'Мультимедия и ИТ',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      science : {
        name : 'Наука',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      mystic : {
        name : 'Мистика',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      charity : {
        name : 'Благотворительность',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      }
    };

    self.meeting = {
      time  : new Date().getHours() + ':' + new Date().getMinutes(),
      place : '',
      categories  : {}
    };

    self.choose_place = function (place) {
      self.option = place;
      if (self.option === 'nearby') {
        $scope.map.show = true;
        ymaps.geolocation.get({ provider : 'browser', mapStateAutoApply : true })
        .then(function (res) {
          var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
          self.meeting.place = $scope.map.spot = coordinates;
          console.log(self.meeting);
        });
      } else if (self.option === 'direction') {
        $scope.map.show = true;
        $scope.$watch(function () { return self.direction },
          function (n, o) {
            if (n === o) return ;
            ymaps.geocode(self.direction, { results : 1 })
            .then(function (res) {
              var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
              self.meeting.place = $scope.map.spot = coordinates;
            });
          }
        );
      } else if (self.option === 'onmap') {
        $scope.map.show = true;
      } else {
        $scope.map.show = false;
        $scope.map.spot = null;
      }
    };

    self.fetch_tags = function (category) {
      self.categories[category].show = !self.categories[category].show;
      if (!self.categories[category].show) return;
      (function () { for (var p in self.categories) { if (self.categories.hasOwnProperty(p) && p != category) self.categories[p].show = false; } })();
      $http.get('/api/meetings/tags/' + category)
      .then(function (res) {
        self.categories[category].tags = res.data[category];
        console.log(self.categories[category].tags);
      })
      .catch(function (res) {
        console.log(res.status);
      });
    };

    self.toggle = function (tag, category) {
      var exists = self.meeting.categories[category];
      console.log(tag + ' ' + category);
      if (exists) {
        var idx = self.meeting.categories[category].indexOf(tag);
        if (idx > -1) self.meeting.categories[category].splice(idx, 1)
        else self.meeting.categories[category].push(tag)
      }
      else self.meeting.categories[category] = [tag];
      console.log(self.meeting.categories[category]);
    };

    self.checked = function (tag, category) {
      return self.meeting.categories[category].indexOf(tag) > -1;
    }

    // $scope.$watch(function () { return self.option; }, function (n, o) {
    //   if (n === o) return ;
    //   else init();
    // });
    //
    // function init () {
    //   ymaps.ready(function () {
    //     if (self.map) {
    //       self.map.destroy();
    //       self.map = null;
    //     }
    //     if (self.option === 'any') {
    //       self.show = false;
    //       console.log('any', self.show, self.map);
    //     } else {
    //       self.map = new ymaps.Map('map', {
    //         center: [55.76, 37.64],
    //         zoom: 11
    //       });
    //       if (self.option === 'nearby') {
    //         self.show = true;
    //         console.log('nearby', self.show, self.map);
    //         var geolocation = ymaps.geolocation;
    //         geolocation.get({ provider : 'browser', mapStateAutoApply : true })
    //           .then(function (res) {
    //             var first  = res.geoObjects.get(0);
    //             var coords = first.geometry.getCoordinates();
    //             var bounds = first.properties.get('boundedBy');
    //             self.meeting.place = coords;
    //             self.map.geoObjects.add(first);
    //             self.map.setBounds(bounds, { checkZoomRange : true });
    //           });
    //       } else if (self.option === 'direction') {
    //         self.show = true;
    //         console.log('direction', self.show, self.map);
    //         $scope.$watch(function () {
    //           return self.direction;
    //         }, function (n, o) {
    //           if (n == o) return ;
    //           ymaps.geocode(self.direction, {
    //             results : 1
    //           })
    //             .then(function (res) {
    //               self.map.geoObjects.removeAll();
    //               var first  = res.geoObjects.get(0);
    //               var coords = first.geometry.getCoordinates();
    //               var bounds = first.properties.get('boundedBy');
    //               self.meeting.place = coords;
    //               self.map.geoObjects.add(first);
    //               self.map.setBounds(bounds, { checkZoomRange : true });
    //             });
    //         });
    //       } else if (self.option === 'onmap'){
    //         self.show = true;
    //         console.log('onmap', self.show, self.map);
    //         self.map.events.add('click', function (e) {
    //           console.log(e.get('coords'));
    //         });
    //       }
    //     }
    //     console.log('the end.', self.show, self.map);
    //   });
    // }
  });
})();

(function () {
  angular.module('FourApp')
  .controller('FriendsController', function (Account, $http) {
    var self = this;

    self.friends = [];

    self.get_friends = function () {
      Account.getProfile()
      .then(function (res) {
        res.data.friends.forEach(function (id) {
          $http.get('/api/users/' + id)
          .then(function (res) {
            self.friends.push(res.data);
          });
        });
        console.log('Got Your Friends Boy!', self.friends);
      })
      .catch(function (res) {
        console.log(res.data ? res.data.message : 'Failed to get Friends', res.status);
      });
    };

    self.get_friends();
  });
})();

(function () {
  angular.module('FourApp')
  .controller('HeadMenuController', function () {
    var self = this;
  });
})();

(function () {
  angular.module('FourApp')
  .controller('HomeController', function () {
    var self = this;
    self.message = 'Home Controller';
  });
})();

(function () {
  angular.module('FourApp')
  .controller('LoginController', function ($mdDialog) {
    var self = this;

    self.message = 'Login Controller';

    self.showDialog = function (ev) {
      $mdDialog.show({
        controller   : 'LoginDialogController',
        controllerAs : 'LoginDialog',
        templateUrl  : 'templates/login.dialog.html',
        parent       : angular.element(document.body),
        targetEvent  : ev,
        clickOutsideToClose : false
      })
      .then(function () {
        self.message += ' hide dialog';
      }, function () {
        self.message += ' close dialog';
      });
    };

    self.showDialog();
  });
})();

(function () {
  angular.module('FourApp')
  .controller('LoginDialogController', function ($mdDialog, $auth, $state) {
    var self = this;

    self.status = 'Войти';

    self.hide   = function () {
      $mdDialog.hide();
    };

    self.change_status = function (status) {
      self.status = status;
    };

    self.providers = [
      { name : 'facebook' , display : 'Facebook' ,  icon : 'facebook.svg'},
      { name : 'google'   , display : 'Google'   ,  icon : 'google.svg'},
      { name : 'instagram', display : 'Instagram',  icon : 'instagram.svg'},
      { name : 'twitter'  , display : 'Twitter'  ,  icon : 'twitter.svg'},
      { name : 'vkontakte', display : 'Vkontakte',  icon : 'vkontakte.svg'}
    ];

    self.signup = function () {
      $auth.signup(self.user)
      .then(function (res) {
        $auth.setToken(res);
        $state.go('home');
        self.hide();
        console.log('Authenticated boys');
      })
      .catch(function (res) {
        console.log('Failed to Authenticate boys');
      });
    };

    self.login = function () {
      $auth.login(self.user)
      .then(function () {
        console.log('Logged in boys');
        $state.go('home');
        self.hide();
      })
      .catch(function (res) {
        console.log('Failed to Login boys');
      });
    };

    self.authenticate = function (provider) {
      $auth.authenticate(provider)
      .then(function () {
        console.log('Authenticated boys');
        $state.go('home');
        self.hide();
      })
      .catch(function (res) {
        console.log('Failed to Authenticate boys');
      });
    };
  });
})();

(function () {
  angular.module('FourApp')
  .controller('LogoutController', function ($state, $auth) {
    if (!$auth.isAuthenticated()) { return ; }
    $auth.logout()
    .then(function () {
      console.log('Logged out boys');
      $state.go('login');
    });
  });
})();

(function () {
  angular.module('FourApp')
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('grey', {
      'default' : '100'
    })
    .accentPalette('deep-orange', {
      'default' : '500'
    });
  });
})();

(function () {
  angular.module('FourApp')
  .controller('MeetingsController', function ($window) {
    var self  = this;
    self.show = false;

    self.meetings = [
      { date : '22/10/2015', title : 'Me & u', loc : 'Moscow', likes : 10, attendees : 5, picture: 'images/avatars/meeting.jpg' },
      { date : '22/10/2015', title : 'Me & u', loc : 'Moscow', likes : 10, attendees : 5, picture: 'images/avatars/meeting.jpg' },
      { date : '22/10/2015', title : 'Me & u', loc : 'Moscow', likes : 10, attendees : 5, picture: 'images/avatars/meeting.jpg' },
      { date : '22/10/2015', title : 'Me & u', loc : 'Moscow', likes : 10, attendees : 5, picture: 'images/avatars/meeting.jpg' },
    ];

    self.toggle_map = function () {
      self.show = !self.show;
      return self.show ? init() : self.map.destroy();
    };

    function init () {
      ymaps.ready(function () {
        self.map = new ymaps.Map('map', {
          center: [55.76, 37.64],
          zoom: 7
        });
      });
    }

    angular.element($window).bind('resize', function () {
      if (self.show) self.map.container.fitToViewport();
    });
  });
})();

(function () {
  angular.module('FourApp')
  .controller('NavbarController', function ($timeout, $mdSidenav, $mdUtil, $log, $auth) {
    var self         = this;
    self.toggleLeft  = toggler('left');

    self.isAuthenticated = function () {
      return $auth.isAuthenticated();
    };

    function toggler (navID) {
      var debounceFn = $mdUtil.debounce(function () {
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug('toggle ' + navID + 'is done');
            });
          }, 200);
      return debounceFn;
    }
  });
})();

(function () {
  angular.module('FourApp')
  .controller('ProfileController', function (Account, $auth, $mdDialog) {
    var self = this;
    self.comb = [];

    self.providers = [
      { name : 'facebook' , display : 'Facebook' ,  icon : 'facebook.svg'},
      { name : 'google'   , display : 'Google'   ,  icon : 'google.svg'},
      { name : 'instagram', display : 'Instagram',  icon : 'instagram.svg'},
      { name : 'twitter'  , display : 'Twitter'  ,  icon : 'twitter.svg'},
      { name : 'vkontakte', display : 'Vkontakte',  icon : 'vkontakte.svg'}
    ];

    self.getProfile = function () {
      Account.getProfile()
      .then(function (res) {
        self.user = res.data;
        self.user.date = self.user.date ? new Date(self.user.date) : new Date();
        console.log(self.user);
      })
      .catch(function (res) {
        console.log(res.data.message, res.status);
      });
    };

    self.updateProfile = function () {
      Account.updateProfile(self.user)
      .then(function () {
        console.log('Profile Updated!');
      })
      .catch(function (res) {
        console.log(res.data.message, res.status);
      });
    };

    self.link = function (provider) {
      $auth.link(provider)
      .then(function () {
        console.log('linked', provider);
        self.getProfile();
      })
      .catch(function (res) {
        console.log(res.data.message, res.status);
      });
    };

    self.unlink = function (provider) {
      $auth.unlink(provider)
      .then(function () {
        console.log('unlinked', provider);
        self.getProfile();
      })
      .catch(function (res) {
        console.log(res.data ? res.data.message : 'Failed unlink' + provider, res.status);
      });
    };

    self.show_upload = function (ev) {
      $mdDialog.show({
        controller   : 'UploadDialog',
        controllerAs : 'Upload',
        templateUrl  : 'templates/upload.dialog.html',
        parent       : angular.element(document.body),
        targetEvent  : ev,
        clickOutsideToClose : true
      })
      .then(function () {
        self.message += ' hide dialog';
      }, function () {
        self.message += ' close dialog';
      });
    };

    self.up   = function (e) { self.comb.push(e.keyCode) };

    self.down = function (e) { self.comb = []; self.comb.push(e.keyCode) };

    self.check = function () {
      if (self.comb.join('').split(0, 4) == '1391') self.updateProfile();
    };

    self.getProfile();
  });
})();

(function () {
  angular.module('FourApp')
  .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
      url : '/',
      templateUrl  : 'templates/home.html',
      controller   : 'HomeController',
      controllerAs : 'Home'
    })
    .state('meetings', {
      url : '/meetings',
      templateUrl  : 'templates/meetings.html',
      controller   : 'MeetingsController',
      controllerAs : 'Meetings',
      resolve      : {
          loginRequired: loginRequired
      }
    })
    .state('new_meeting', {
      url : '/new_meeting',
      templateUrl  : 'templates/new.meeting.html',
      controller   : 'NewMeetingController',
      controllerAs : 'NewMeeting',
      resolve      : {
          loginRequired: loginRequired
      }
    })
    .state('profile', {
      url : '/profile',
      templateUrl  : 'templates/profile.html',
      controller   : 'ProfileController',
      controllerAs : 'Profile',
      resolve      : {
          loginRequired: loginRequired
      }
    })
    .state('user', {
      url : '/user/:id',
      templateUrl  : 'templates/user.html',
      controller   : 'UserController',
      controllerAs : 'User'
    })
    .state('friends', {
      url : '/friends',
      templateUrl  : 'templates/friends.html',
      controller   : 'FriendsController',
      controllerAs : 'Friends',
      resolve      : {
          loginRequired: loginRequired
      }
    })
    .state('chats', {
      url : '/chats',
      templateUrl  : 'templates/chats.html',
      controller   : 'ChatsController',
      controllerAs : 'Chats',
      resolve      : {
          loginRequired: loginRequired
      }
    })
    .state('chat', {
      url : '/chats/:id',
      templateUrl  : 'templates/chat.html',
      controller   : 'ChatController',
      controllerAs : 'Chat',
      resolve      : {
          loginRequired: loginRequired
      }
    })
    .state('login', {
      url : '/login',
      templateUrl  : 'templates/login.html',
      controller   : 'LoginController',
      controllerAs : 'Login',
      resolve : {
        skipIfLoggedIn : skipIfLoggedIn
      }
    })
    .state('logout', {
      url        : '/logout',
      template   : null,
      controller : 'LogoutController'
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
  .controller('SideNavLeftController', function ($timeout, $mdSidenav, $log) {
    var self   = this;

    self.menu = [
      { name : 'Мой Кабинет'  , route : 'profile'  , icon : 'profile.svg'},
      { name : 'Друзья'       , route : 'friends'  , icon : 'friends.svg'},
      { name : 'Сообщения'    , route : 'chats'    , icon : 'msg.svg'},
      { name : 'Аллея Славы'  , route : 'alley'    , icon : 'star.svg'},
      { name : 'Новости'      , route : 'news'     , icon : 'news.svg'},
      { name : 'Статьи'       , route : 'articles' , icon : 'article.svg'},
      { name : 'Мой Календарь', route : 'calendar' , icon : 'calendar.svg'},
      { name : 'Встречи'      , route : 'meetings' , icon : 'meeting.svg'},
      { name : 'Избранное'    , route : 'favorites', icon : 'clipy.svg'},
      { name : 'Доска желаний', route : 'wishlist' , icon : 'wishlist.svg'},
    ];

    self.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug('close Left is done.');
        });
    };
  });
})();

(function () {
  angular.module('FourApp')
  .controller('UploadDialog', function ($mdDialog, Account, $state, $http, $scope) {
    var self = this;

    self.upload = function () {
      var fd = new FormData();
      fd.append('file', $scope.myFile);
      $http.post('/api/uploads/avatars', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
      .then(function (res) {
        self.image = res.data.picture;
        console.log(res, 'WE did it Fam!');
      })
      .catch(function (res) {
        console.log('rekt', res.status);
      });
    };

    self.close = function () {
      $mdDialog.hide();
      $state.go('profile');
    };
    
  });
})();

(function () {
  angular.module('FourApp')
  .directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
  }]);
})();

(function () {
  angular.module('FourApp')
  .controller('UserController', function ($stateParams, $http) {
    var self = this;

    self.getProfile = function () {
      $http.get('/api/users/' + $stateParams.id)
      .then(function (res) {
        self.user = res.data;
        console.log(self.user);
      })
      .catch(function (res) {
        console.log(res.data.message, res.status);
      });
    };

    self.add_friend = function () {
      $http.post('/api/users/' + $stateParams.id + '/friend')
      .then(function (res) {
        console.log(res.data.message);
      })
      .catch(function (res) {
        console.log(res.data ? res.data.message : 'Failed to Friend', res.status);
      });
    };

    self.message = 'Requested id: ' + $stateParams.id;
    self.getProfile();
  });
})();
