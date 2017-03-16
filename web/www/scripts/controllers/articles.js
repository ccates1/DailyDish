var app = angular.module('dailydish');

app.controller('ArticlesCtrl', function ($scope, $auth, $service, $timeout,
  toastr, $state, moment) {
  $scope.articles = [];
  $scope.nba = [];
  $scope.mlb = [];
  $scope.nfl = [];
  $scope.authors = [
  ];
  $scope.loading = true;
  $(function () {
    document.getElementById('articles').parentElement.className = 'activated';
    $timeout(function () {
      $scope.$apply();
    });
  });
  $scope.$on('$destroy', function () {
    document.getElementById('articles').parentElement.className = '';
    $timeout(function () {
      $scope.$apply();
    });
  });

  var getUser = function () {
    $service.getUser()
      .then(function (res) {
        if (res.data === "") {
          $auth.logout();
          $state.go('login');
        } else {
          $scope.user = res.data;
        }
      })
      .catch(function (err) {
        $timeout(function () {
          $state.go('login');
        });
      });
  };
  var getArticles = function () {
    $service.articlesList()
      .then(function (res) {
        $scope.articles = res.data;
        if ($scope.articles) {
          for(var i = 0; i < $scope.articles.length; i++) {
            var article = $scope.articles[i];
            console.log(article);
            article.totalStars = 0;
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
          }
          $scope.loading = false;
        } else {
          $scope.loading = false;
        }
        $timeout(function () {
          $scope.$apply();
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  getUser();
  getArticles();

  $scope.getNumber = function (article) {
    return new Array(Math.round(article.averageStars));
  };
});

app.directive('matchHeight', ['$timeout', function ($timeout) {
    var linkFunction = function(scope, element) {
      $timeout(function() {
        angular.element(element).find('.equal').matchHeight();
      });
    };
    return {
      restrict: 'A',
      link: linkFunction
    };
}]);
