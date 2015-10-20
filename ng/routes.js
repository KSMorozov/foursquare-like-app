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
