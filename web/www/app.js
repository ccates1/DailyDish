angular.module('dailydish', ['dailydish.controllers', 'dailydish.services',
  'ui.router', 'satellizer', 'ngAnimate', 'toastr'])
.config(function($stateProvider, $urlRouterProvider, $authProvider, toastrConfig) {
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
    })
    .state('articleTemplate', {
      url: '/articleTemplate',
      templateUrl: 'templates/articleTemplate.html',
      controller: 'ArticleTemplateCtrl'
    });

  $urlRouterProvider.otherwise('/');

  function verifyLoginState($q, $auth) {
    var deferred = $q.defer();
    if($auth.isAuthenticated()) {
      deferred.reject();
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  angular.extend(toastrConfig, {
    autoDismiss: true,
    containerId: 'toast-container',
    maxOpened: 0,
    newestOnTop: true,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    preventOpenDuplicates: true,
    target: 'body'
  });
});
