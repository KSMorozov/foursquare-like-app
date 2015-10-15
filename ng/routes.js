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
