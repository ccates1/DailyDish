var app = angular.module('dailydish');

app.controller('ArticleCtrl', function ($scope, $auth, $service, $timeout, article) {
  $scope.article = article;
  console.log(article);
  $scope.loading = true;
  var getUser = function() {
    $service.getUser()
    .then(function(res) {
      $scope.user = res.data;
      $scope.loading = false;
    })
    .catch(function(err) {
      $timeout(function() {
        $state.go('login');
      });
      console.log(err);
    });
  };
  getUser();
});
