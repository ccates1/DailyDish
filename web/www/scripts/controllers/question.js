var app = angular.module('dailydish');

app.controller('QuestionCtrl', function ($scope, $auth, $service, $timeout, question) {
  $scope.question = question;
  var getUser = function() {
    $service.getUser()
    .then(function(res) {
      $scope.user = res.data;
      console.log($scope.user)
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
