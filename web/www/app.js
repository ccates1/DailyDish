(function () {
    "use strict";

    var app = angular.module('dailydish', ['dailydish.services', 'isteven-multi-select', 'ui.bootstrap', 'ui.router', 'satellizer', 'ngAnimate', 'toastr', 'angular-filepicker', 'angularMoment', 'angularUtils.directives.dirPagination', 'summernote', 'ngSanitize'])

    app.config(['$stateProvider', '$urlRouterProvider', '$authProvider', 'toastrConfig', 'filepickerProvider', '$qProvider', function ($stateProvider, $urlRouterProvider, $authProvider, toastrConfig, filepickerProvider, $qProvider) {
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
                url: '/',
                templateUrl: 'templates/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .state('articles', {
                url: '/articles',
                templateUrl: 'templates/articles.html',
                controller: 'ArticlesCtrl'
            })
            .state('article', {
                url: '/articles/{id}',
                templateUrl: 'templates/article.html',
                controller: 'ArticleCtrl',
                resolve: {
                    article: [
                        '$stateParams', '$service', '$q',
                        function ($stateParams, $service, $q) {
                            return $service.getArticle($stateParams.id).then(function (res) {
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
            .state('question', {
                url: '/questions/{id}',
                templateUrl: 'templates/question.html',
                controller: 'QuestionCtrl',
                resolve: {
                    question: [
                        '$stateParams', '$service', '$q',
                        function ($stateParams, $service, $q) {
                            return $service.getQuestion($stateParams.id).then(function (res) {
                                return res.data;
                            });
                        }
                    ]
                }
            })
            .state('articleTemplate', {
                url: '/articleTemplate',
                templateUrl: 'templates/articleTemplate.html',
                controller: 'ArticleTemplateCtrl'
            });

        $urlRouterProvider.otherwise('/');

        function verifyLogin($q, $auth, $state, $timeout) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                deferred.reject();
            } else {
                deferred.resolve();
            }
            return deferred.promise;
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
            // preventDuplicates: true,
            preventOpenDuplicates: true,
            target: 'body'
        });
        filepickerProvider.setKey('AbSjhS08QQSp8MTH9l5oFz');
    }]);

    app.run(['$rootScope', '$auth', '$service', '$state', '$q', function ($rootScope, $auth, $service, $state, $q) {


        $rootScope.isAuthenticated = function () {
            return $auth.isAuthenticated();
        };


    }]);

})()
