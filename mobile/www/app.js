angular.module('dailydish', ['ionic', 'dailydish.controllers', 'dailydish.services', 'ui.router', 'satellizer'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    resolve: {
      verifyLoginState: verifyLoginState
    }
  })
  .state('tabs', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tabs.dashboard', {
    url: '/dashboard',
    views: {
      'dashboard-tab': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  })
  .state('tabs.articles', {
    url: '/articles',
    views: {
      'articles-tab': {
        templateUrl: 'templates/articles.html',
        controller: 'ArticlesCtrl'
      }
    }
  })
  .state('tabs.questions', {
    url: '/questions',
    views: {
      'questions-tab': {
        templateUrl: 'templates/questions.html',
        controller: 'QuestionsCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/login');

  function verifyLoginState($q, $auth) {
    var deferred = $q.defer();
    if($auth.isAuthenticated()) {
      deferred.reject();
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }
});
