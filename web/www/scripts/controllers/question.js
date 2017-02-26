var app = angular.module('dailydish');

app.controller('QuestionCtrl', function ($scope, $auth, $service, $timeout,
  question, toastr, $state, moment, $uibModal) {
  $scope.question = question;
  console.log(question);
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

  $scope.openAnswerModal = function() {
    $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'mobal-body',
      templateUrl: 'answerModal.html',
      controller: 'AnswerModalInstanceCtrl',
      size: 'sm',
      scope: $scope,
      backdrop: 'static'
    });
  };

});

app.controller('AnswerModalInstanceCtrl', function($scope, $uibModalInstance, $service, toastr, $state, moment) {
  $scope.answer = {};

  $scope.submitAnswer = function() {
    if($scope.answer.content === '') {
      toastr.err("Answer is blank.");
      return;
    } else {
      $scope.answer.author = $scope.user._id;
      $scope.answer.rating = 0;
      $scope.answer.date = moment.now();
      $scope.answer.likes = 0;
      $scope.answer.dislikes = 0;
      $service.addAnswer($scope.question, $scope.answer)
        .then(function(res) {
          $state.reload();
          toastr.success('Your answer has been posted!', 'Success');
        })
        .catch(function(err) {
          console.log(err);
          toastr.error('There was an error when submitting your comment.');
        });
    }
  };
});
