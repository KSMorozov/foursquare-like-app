(function () {
  angular.module('FourApp', ['ngMaterial',
                             'ui.router',
                             'satellizer',
                             'ymaps'])
  .run(['$rootScope', '$state', function($rootScope, $state) { $rootScope.$state = $state; }]);
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
    .state('meeting', {
      url : '/meeting/:id',
      templateUrl  : 'templates/meeting.html',
      controller   : 'MeetingController',
      controllerAs : 'Meeting',
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
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange', {
      'default' : '500'
    })
    .accentPalette('deep-orange', {
      'default' : '500'
    });
    $mdThemingProvider.theme('background')
    .backgroundPalette('grey', {
      'default': '100'
    })
    .primaryPalette('grey', {
      'default': '100'
    })
    .accentPalette('grey', {
      'default': '100'
    });
  });
})();

(function () {
  angular.module('FourApp')
  .controller('CategoriesDialog', function ($mdDialog, $state, $http, $scope, $rootScope, Utils) {
    var self = this;

    self.meeting = {
      categories : [],
      tags       : []
    };

    self.categories = {
      movies : {
        name : 'Кино',
        show : false,
        tags : [],
        pic  : 'images/category_icons/movies.png'
      },
      food : {
        name : 'Еда',
        show : false,
        tags : [],
        pic  : 'images/category_icons/food.png'
      },
      sports : {
        name : 'Спорт',
        show : false,
        tags : [],
        pic  : 'images/category_icons/sports.png'
      },
      arts : {
        name : 'Творчество',
        show : false,
        tags : [],
        pic  : 'images/category_icons/arts.png'
      },
      eco : {
        name : 'Природа',
        show : false,
        tags : [],
        pic  : 'images/category_icons/eco.png'
      },
      dance : {
        name : 'Танцы',
        show : false,
        tags : [],
        pic  : 'images/category_icons/dance.png'
      },
      music : {
        name : 'Музыка',
        show : false,
        tags : [],
        pic  : 'images/category_icons/music.png'
      },
      cars : {
        name : 'Транспорт',
        show : false,
        tags : [],
        pic  : 'images/category_icons/cars.png'
      },
      theatre : {
        name : 'Театр',
        show : false,
        tags : [],
        pic  : 'images/category_icons/theatre.png'
      },
      it : {
        name : 'Мультимедия и ИТ',
        show : false,
        tags : [],
        pic  : 'images/category_icons/it.png'
      },
      science : {
        name : 'Наука',
        show : false,
        tags : [],
        pic  : 'images/category_icons/science.png'
      },
      mystic : {
        name : 'Мистика',
        show : false,
        tags : [],
        pic  : 'images/category_icons/mystic.png'
      },
      charity : {
        name : 'Благотворительность',
        show : false,
        tags : [],
        pic  : 'images/category_icons/charity.png'
      }
    };

    self.fetch_tags = function (category) {
      self.categories[category].show = !self.categories[category].show;
      if (!self.categories[category].show) return;
      (function () { for (var p in self.categories) { if (self.categories.hasOwnProperty(p) && p != category) self.categories[p].show = false; } })();
      Utils.fetch_tags_for_category(category)
      .then(function (res) {
        self.categories[category].tags = res.data.tags;
      });
    };

    self.toggle = function (tag, category) {
      var idx_tag = self.meeting.tags.indexOf(tag);
      if (idx_tag > -1) self.meeting.tags.splice(idx_tag, 1);
      else self.meeting.tags.push(tag);

      var idx_cat = self.meeting.categories.indexOf(category);
      var liable  = self.meeting.tags.filter(function (e) {
        return self.categories[category].tags.indexOf(e) > -1;
      }).length;

      if (!liable) self.meeting.categories.splice(idx_cat, 1);
      else if (self.meeting.categories.indexOf(category) === -1) {
        self.meeting.categories.push(category);
      }
    };

    self.checked = function (tag, category) {
      return self.meeting.tags.indexOf(tag) > -1;
    };

    self.cancel = function () {
      $mdDialog.cancel();
    };

    self.confirm = function () {
      $rootScope.$emit('apply_tags', self.meeting);
      $mdDialog.hide();
    };

  });
})();

(function () {
  angular.module('FourApp')
  .controller('InvitesDialog', function ($scope, $mdDialog, meeting_id, Account, Toast, Invite) {
    var self = this;

    $scope.send_invites = function () {
      var friends = $scope.friends.filter(function (e) {
        if (e.selected) return e;
      }).map(function (e) {
        return e.friend_id;
      });
      Invite.send_invites({ friends : friends, meeting : meeting_id })
      .then(function (res) {
        Toast.show_toast('success', res.data.message);
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.data.message);
      });
      self.confirm();
    };

    $scope.toggle_all_friends = function (val) {
      $scope.friends = $scope.friends.map(function (e) {
        e.selected = val;
        return e;
      });
    };

    $scope.fetch_friends = function () {
      Account.fetch_friends()
      .then(function (res) {
        $scope.friends = res.data;
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.data.message);
      });
    };

    self.cancel = function () {
      $mdDialog.cancel();
    };

    self.confirm = function () {;
      $mdDialog.hide();
    };

    $scope.fetch_friends();
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
  .controller('HeadMenuController', function () {
    var self = this;
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
  .controller('SecondToolbarController', function ($scope, $rootScope) {
    var self = this;
    $scope.location = '';
    $scope.cities = [{ name : 'Москва'}, { name : 'Екатеринбург' }];

    ymaps.ready(function () {
      var geolocation = ymaps.geolocation;
      geolocation.get({ provider : 'browser' })
      .then(function (res) {
        var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
        ymaps.geocode(coordinates, {
          results : 1
        }).then(function (res) {
          var location = res.geoObjects.get(0).properties.get('text').split(',')[1];
          $scope.location = location;
          $rootScope.user_city = location;
          $scope.$apply();
        });
      });
    });

    $scope.$watch(function () { return $scope.location }, function (new_value, old_value) {
      ymaps.ready(function () {
        ymaps.geocode(new_value, { results : 1 })
        .then(function (res) {
          var coords = res.geoObjects.get(0).geometry.getCoordinates();
          $rootScope.user_city_coords = coords;
          $rootScope.$emit('city_change', coords);
        });
      });
    });
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
  .controller('SideNavRightController', function ($mdDialog) {
    var self = this;

    self.show_categories = function (ev) {
      $mdDialog.show({
        controller   : 'CategoriesDialog',
        controllerAs : 'Categories',
        templateUrl  : 'templates/categories.dialog.html',
        parent       : angular.element(document.body),
        targetEvent  : ev,
        clickOutsideToClose : true
      })
      .then(function () {

      }, function () {

      });
    };
  });
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
      },
      fetch_friends : function () {
        return $http.get('/api/me/friends');
      }
    };
  });
})();

(function () {
  angular.module('FourApp')
  .factory('Comment', function ($http) {
    return {
      send_comment : function (comment) {
        return $http.post('/api/comments', comment);
      },
      fetch_comments : function (thing_id) {
        return $http.get('/api/comments/', { params : { id : thing_id } });
      }
    };
  });
})();

(function () {
  angular.module('FourApp')
  .factory('Invite', function ($http) {
    return {
      send_invites : function (friends) {
        return $http.post('/api/invites', friends);
      },
      fetch_invites : function (addresser_id) {
        return $http.get('/api/invites', { params : { addresser : addresser_id } });
      },
      respond_invite : function (action, invite_id, meeting_id) {
        return $http.post('/api/invites/respond', { action : action, invite_id : invite_id, meeting_id : meeting_id });
      }
    };
  });
})();

(function () {
  angular.module('FourApp')
  .factory('Meeting', function ($http) {
    return {
      create_meeting : function (meeting) {
        return $http.post('/api/meetings', meeting);
      },
      fetch_meetings : function (filters) {
        return $http.get('/api/meetings/', { params : filters });
      },
      fetch_meeting : function (id) {
        return $http.get('/api/meetings/single', { params : { id : id } });
      },
      attend_meeting : function (meeting) {
        return $http.post('/api/meetings/attend', { id : meeting });
      }
    };
  });
})();

(function () {
  angular.module('FourApp')
  .factory('Toast', function ($http, $mdToast) {
    function getToastPosition () {
      sanitizePosition();
      return Object.keys(toastPosition)
        .filter(function (pos) { return toastPosition[pos]; })
        .join(' ');
    }

    function sanitizePosition() {
      var current = toastPosition;
      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;
      last = angular.extend({},current);
    }

    var last = {
      bottom : false,
      top    : true,
      left   : false,
      right  : true
    };

    var toastPosition = angular.extend({}, last);

    return {
      show_toast : function (type, msg) {
        var toast = $mdToast.simple().theme(type + '-toast')
          .content(msg)
          .position(getToastPosition())
          .hideDelay(3000);
        $mdToast.show(toast);
      }
    };

  });
})();


(function () {
  angular.module('FourApp')
  .factory('Utils', function ($http) {
    return {
      fetch_tags_for_category : function (category) {
        return $http.get('/utils/categories/' + '?category=' + category);
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
  .controller('ChatController', function ($scope, $stateParams, $http, Account, Invite, Toast) {
    var self = this;

    self.comb     = [];
    self.messages = [];
    self.me       = {};
    self.friend   = {};

    $scope.respond_invite = function (action, invite_id, meeting_id) {
      Invite.respond_invite(action, invite_id, meeting_id)
      .then(function (res) {
        Toast.show_toast('success', res.data.message);
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.data.message);
      });
    };

    self.fetch_invites = function () {
      Invite.fetch_invites($stateParams.id)
      .then(function (res) {
        $scope.invites = res.data.invites;
        console.log(res.data);
        Toast.show_toast('success', res.data.message);
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.data.message);
      });
    };

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
    self.fetch_invites();
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
  .controller('NewMeetingController', function ($http, $window, $scope, $mdToast,
                                                Account, Utils, Meeting, Toast) {
    var self  = this;
    $scope.map = {
      center : [55.76, 37.64],
      zoom   : 11,
      show   : false,
      spot   : null,
      options: { draggable : false }
    };

    self.categories = {
      movies : {
        name : 'Кино',
        show : false,
        tags : [],
        pic  : 'images/category_icons/movies.png'
      },
      food : {
        name : 'Еда',
        show : false,
        tags : [],
        pic  : 'images/category_icons/food.png'
      },
      sports : {
        name : 'Спорт',
        show : false,
        tags : [],
        pic  : 'images/category_icons/sports.png'
      },
      arts : {
        name : 'Творчество',
        show : false,
        tags : [],
        pic  : 'images/category_icons/arts.png'
      },
      eco : {
        name : 'Природа',
        show : false,
        tags : [],
        pic  : 'images/category_icons/eco.png'
      },
      dance : {
        name : 'Танцы',
        show : false,
        tags : [],
        pic  : 'images/category_icons/dance.png'
      },
      music : {
        name : 'Музыка',
        show : false,
        tags : [],
        pic  : 'images/category_icons/music.png'
      },
      cars : {
        name : 'Транспорт',
        show : false,
        tags : [],
        pic  : 'images/category_icons/cars.png'
      },
      theatre : {
        name : 'Театр',
        show : false,
        tags : [],
        pic  : 'images/category_icons/theatre.png'
      },
      it : {
        name : 'Мультимедия и ИТ',
        show : false,
        tags : [],
        pic  : 'images/category_icons/it.png'
      },
      science : {
        name : 'Наука',
        show : false,
        tags : [],
        pic  : 'images/category_icons/science.png'
      },
      mystic : {
        name : 'Мистика',
        show : false,
        tags : [],
        pic  : 'images/category_icons/mystic.png'
      },
      charity : {
        name : 'Благотворительность',
        show : false,
        tags : [],
        pic  : 'images/category_icons/charity.png'
      }
    };

    self.meeting = {
      place      : '',
      categories : [],
      tags       : []
    };

    self.create_meeting = function () {
      Meeting.create_meeting(self.meeting)
      .then(function (res) {
        Toast.show_toast('success', res.data.message);
        // redirect to specific meeting route
        // id of meeting available at res.data.message_id
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.data.message);
      });
      self.meeting = {};
    };

    self.choose_place = function (place) {
      self.option = place;
      if (self.option === 'nearby') {
        $scope.map.show = true;
        ymaps.geolocation.get({ provider : 'browser', mapStateAutoApply : true })
        .then(function (res) {
          var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
          self.meeting.place = $scope.map.spot = coordinates;
        });
        $scope.map.options.draggable = false;
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
        $scope.map.options.draggable = false;
      } else if (self.option === 'onmap') {
        $scope.map.spot = null;
        $scope.map.show = true;
        ymaps.geolocation.get({ provider : 'browser', mapStateAutoApply : true })
        .then(function (res) {
          var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
          self.meeting.place = $scope.map.spot = coordinates;
        });
        $scope.$watch(function () { return $scope.map.center; },
          function (n, o) {
            if (n[0] === o[0] && n[1] === o[1]) return ;
            self.meeting.place = n;
          }
        );
        $scope.map.options.draggable = true;
      } else {
        $scope.map.show = false;
        $scope.map.spot = null;
        $scope.map.options.draggable = false;
      }
    };

    self.fetch_tags = function (category) {
      self.categories[category].show = !self.categories[category].show;
      if (!self.categories[category].show) return;
      (function () { for (var p in self.categories) { if (self.categories.hasOwnProperty(p) && p != category) self.categories[p].show = false; } })();
      Utils.fetch_tags_for_category(category)
      .then(function (res) {
        self.categories[category].tags = res.data.tags;
      });
    };

    self.toggle = function (tag, category) {
      var idx_tag = self.meeting.tags.indexOf(tag);
      if (idx_tag > -1) self.meeting.tags.splice(idx_tag, 1);
      else self.meeting.tags.push(tag);

      var idx_cat = self.meeting.categories.indexOf(category);
      var liable  = self.meeting.tags.filter(function (e) {
        return self.categories[category].tags.indexOf(e) > -1;
      }).length;

      if (!liable) self.meeting.categories.splice(idx_cat, 1);
      else if (self.meeting.categories.indexOf(category) === -1) {
        self.meeting.categories.push(category);
      }
    };

    self.checked = function (tag, category) {
      return self.meeting.tags.indexOf(tag) > -1;
    };

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

(function () {
  angular.module('FourApp')
  .controller('MeetingsController', function ($window, $http, $scope, $rootScope, Toast, Meeting, $mdDialog) {
    var self  = this;

    self.show = false;
    $scope.meetings = [];
    $scope.addresses = [];

    $scope.location = $rootScope.user_city_coords;

    $scope.date_filter;

    $scope.show_invites = function (ev, id) {
      var meeting_id = id;

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

    $scope.underground_station  = '';
    $scope.underground_stations = [{ name : 'Бульвар Рокоссовского' },
                                   { name : 'Авиамоторная' },
                                   { name : 'Первомайская' },
                                   { name : 'Щелковская'}];

    $scope.filters = {
      location_filter : $scope.location
    };

    self.toggle_map = function () {
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

    self.fetch_meetings = function (filters) {
      console.log(filters);
      Meeting.fetch_meetings(filters)
      .then(function (res) {
        if(!res.data.length) Toast.show_toast('failed', 'Отсутствуют Встречи по заданным критериям.');
        $scope.meetings = res.data;
        console.log($scope.meetings);
      });
    };

    $scope.fetch_address = function (coords, index) {
      if (!coords) return;
      ymaps.ready(function () {
        ymaps.geocode(coords, {
          results : 1
        })
        .then(function (res) {
          // console.log(res.geoObjects.get(0).properties.get('name'));
          // console.log(res.geoObjects.get(0).properties.get('text'));
          $scope.addresses[index] = res.geoObjects.get(0).properties.get('text');
          $scope.$apply();
        })
        .catch(function () {
          $scope.addresses[index] = '';
          $scope.$apply();
        });
      });
    };

    self.show_onmap = function (loc, address) {
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

    $scope.add_friend = function (id) {
      console.log('hey', id);
      $http.post('/api/users/' + id + '/friend')
      .then(function (res) {
        console.log(res.data.message);
      })
      .catch(function (res) {
        console.log(res.data ? res.data.message : 'Failed to Friend', res.status);
      });
    };

    $scope.attend_meeting = function (id) {
      Meeting.attend_meeting(id)
      .then(function (res) {
        Toast.show_toast('success', res.data.message);
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.status === 304 ? 'Вы уже откликнулись на эту встречу ранее.' : 'Произошла ошибка :(.');
      });
    };

    self.apply_nearby = function () {
      ymaps.ready(function () {
        ymaps.geolocation.get({ provider : 'browser' })
        .then(function (res) {
          var coords = res.geoObjects.get(0).geometry.getCoordinates();
          $scope.location = coords;
          $scope.$apply();
        });
      });
    };

    $rootScope.$on('apply_tags', function (event, data) {
      $scope.filters.tags_filter = data.tags;
    });

    $rootScope.$on('city_change', function (event, data) {
      $scope.location = data;
      $scope.$apply();
    });

    $scope.$watch(function () { return $scope.date_filter }, function (new_value, old_value) {
      if (!new_value || +new_value === +old_value) return;
      $scope.filters.date_filter = new Date(new_value);
    });

    $scope.$watch(function () { return $scope.underground_station }, function (new_value, old_value) {
      if (!new_value || new_value === old_value) return;
      ymaps.ready(function () {
        ymaps.geocode($rootScope.user_city + ' метро ' + new_value, {
          results : 1
        })
        .then(function (res) {
          var coords = res.geoObjects.get(0).geometry.getCoordinates();
          $scope.location = coords;
          $scope.$apply();
        })
      });
    });

    $scope.$watch(function () { return $scope.location }, function (new_value, old_value) {
      if(!new_value || new_value === old_value) return;
      $scope.filters.location_filter = new_value;
    });

    $scope.$watch(function () { return $scope.filters }, function (new_value, old_value) {
      if (!new_value || new_value === old_value) return;
      self.fetch_meetings(new_value);
    }, true)

    angular.element($window).bind('resize', function () {
      if (self.show) self.map.container.fitToViewport();
    });

    self.fetch_meetings($scope.filters);
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
