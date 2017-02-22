angular.module('dailydish', ['dailydish.services', 'isteven-multi-select', 'ui.bootstrap',
        'ui.router', 'satellizer', 'ngAnimate', 'toastr', 'angular-filepicker', 'angularMoment'
    ])
    .config(function($stateProvider, $urlRouterProvider, $authProvider, toastrConfig, filepickerProvider, $qProvider) {
      $qProvider.errorOnUnhandledRejections(false);
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl',
                resolve: {
                    verifyLogin: verifyLogin
                }
            })
            .state('logout', {
                url: '/logout',
                templateUrl: null,
                controller: 'LogoutCtrl'
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
            .state('article', {
              url: '/acticles/{id}',
              templateUrl: 'templates/article.html',
              controller: 'ArticleCtrl',
              resolve: {
                article: [
                  '$stateParams', '$service', '$q',
                  function($stateParams, $service, $q) {
                    return $service.getArticle($stateParams.id).then(function(res) {
                      return res.data;
                    });
                  }
                ]
              }
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

        $urlRouterProvider.otherwise('/login');

        function verifyLogin($q, $auth, $state, $timeout) {
            if ($auth.isAuthenticated()) {
                $timeout(function() {
                    $state.go('dashboard');
                });
            }
        }

        $authProvider.facebook({
          clientId: '289121131435901'
        });

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
        filepickerProvider.setKey('AbSjhS08QQSp8MTH9l5oFz');
    });
