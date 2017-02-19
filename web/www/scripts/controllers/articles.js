var app = angular.module('dailydish');

app.controller('ArticlesCtrl', function ($scope, $auth, $service, $timeout,
  toastr, $state) {
    $scope.articles = [];
    $scope.nba = [];
    $scope.mlb = [];
    $scope.nfl = [];
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
        $scope.user = res.data;
      })
      .catch(function (err) {
        $timeout(function () {
          $state.go('login');
        });
        console.log(err);
      });
  };
  var getArticles = function () {
    $service.articlesList()
      .then(function (res) {
        $scope.articles = res.data;
        if($scope.articles) {
          $scope.articles.forEach(function(article) {
            if(article.sports.includes('NBA')) {
              $scope.nba.push(article);
            }
            if(article.sports.includes('NFL')) {
              $scope.nfl.push(article);
            }
            if(article.sports.includes('MLB')) {
              $scope.mlb.push(article);
            }
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  getUser();
  getArticles();

});
