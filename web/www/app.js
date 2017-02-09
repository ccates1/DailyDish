angular.module('dailydish', ['dailydish.controllers', 'dailydish.services', 'ui.router', 'satellizer'])
.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
    resolve: {
      verifyLoginState: verifyLoginState
    }
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'templates/dashboard.html',
    controller: 'DashboardCtrl'
  })
  .state('articles', {
    url: '/articles',
    templateUrl: 'templates/articles.html',
    controller: 'ArticlesCtrl'
  })
  .state('questions', {
    url: '/questions',
    templateUrl: 'templates/questions.html',
    controller: 'QuestionsCtrl'
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
