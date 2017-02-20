var app = angular.module('dailydish');

app.controller('ArticleCtrl', function ($scope, $auth, $service, $timeout, article) {
  $scope.article = article;
  console.log(article);
});
