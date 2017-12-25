(function () {
    "use strict";

    var app = angular.module('dailydish');


    app.controller('ArticlesCtrl', ['$scope', '$auth', '$service', '$timeout', 'toastr', '$state', function ($scope, $auth, $service, $timeout, toastr, $state) {

        $("[rel='tooltip']").tooltip();

        $scope.articles = [];
        $scope.nba = [];
        $scope.mlb = [];
        $scope.nfl = [];
        $scope.authors = [];
        $scope.loading = true;

        var getUser = function () {
            $service.getUser()
                .then(function (res) {
                    if (res.data === "") {
                        $auth.logout();
                        $state.go('login');
                    } else {
                        $scope.user = res.data;
                        getArticles();
                    }
                })
                .catch(function (err) {
                    $state.go('login');
                });
        };

        var getArticles = function () {
            $service.articlesList()
                .then(function (res) {
                    var articles = $scope.articles = res.data;

                    _.each(articles, function (article) {
                        article.totalStars = 0;
                        article.intdate = parseFloat(article.date);
                        if (!article.author.picture) {
                            article.author.picture = '../img/default.png';
                        }
                        if (article.sports.includes('NBA')) {
                            $scope.nba.push(article);
                        }
                        if (article.sports.includes('NFL')) {
                            $scope.nfl.push(article);
                        }
                        if (article.sports.includes('MLB')) {
                            $scope.mlb.push(article);
                        }
                        if (article.articleRatings.length > 0) {
                            article.isEmpty = false;
                            article.articleRatings.forEach(function (articleRating) {
                                article.totalStars += articleRating.rating;
                            });
                            article.averageStars = article.totalStars / article.articleRatings.length;
                        }
                    })

                    $scope.loading = false;

                })
                .catch(function (err) {
                    console.log(err);
                });
        };
        getUser();

        $scope.getNumber = function (article) {
            if (article && article.averageStars) {
                return new Array(Math.round(article.averageStars));
            } else {
                return false;
            }
        };
    }]);

    app.directive('matchHeight', ['$timeout', function ($timeout) {
        var linkFunction = function (scope, element) {
            $timeout(function () {
                angular.element(element).find('.equal').matchHeight();
            });
        };
        return {
            restrict: 'A',
            link: linkFunction
        };
    }]);
})();