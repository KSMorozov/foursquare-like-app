(function () {
  angular.module('FourApp', ['ngMaterial',
                             'ui.router',
                             'satellizer'])
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

    self.hide   = function () {
      $mdDialog.hide();
    };

    self.cancel = function () {
      $mdDialog.cancel();
    };

    var providers = [
      { name : 'facebook' , display : 'Facebook' ,  icon : 'facebook.svg'},
      { name : 'google'   , display : 'Google'   ,  icon : 'google.svg'},
      { name : 'instagram', display : 'Instagram',  icon : 'instagram.svg'},
      { name : 'twitter'  , display : 'Twitter'  ,  icon : 'twitter.svg'},
      { name : 'vkontakte', display : 'Vkontakte',  icon : 'vkontakte.svg'}
    ];

    self.login = function () {
      $auth.login(self.user)
      .then(function () {
        console.log('Logged in boys');
        $state.go('home');
        self.hide();
      })
      .catch(function (res) {

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

      });
    }
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
    .accentPalette('deep-orange');
  });
})();

(function () {
  angular.module('FourApp')
  .controller('MessagesController', function () {
    
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
  .controller('ProfileController', function (Account, $auth) {
    var self = this;

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
    }

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
    .state('profile', {
      url : '/profile',
      templateUrl  : 'templates/profile.html',
      controller   : 'ProfileController',
      controllerAs : 'Profile',
    })
    .state('messages', {
      url : '/messages',
      templateUrl  : 'templates/messages.html',
      controller   : 'MessagesController',
      controllerAs : 'Messages',
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

    // $state.go('home.login');
  });
})();

(function () {
  angular.module('FourApp')
  .controller('SideNavLeftController', function ($timeout, $mdSidenav, $log) {
    var self   = this;

    self.menu = [
      { name : 'Мой Кабинет'  , route : 'profile'  , icon : 'profile.svg'},
      { name : 'Друзья'       , route : 'friends'  , icon : 'friends.svg'},
      { name : 'Сообщения'    , route : 'messages' , icon : 'msg.svg'},
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
