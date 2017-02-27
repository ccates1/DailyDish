var app = angular.module('dailydish');

app.controller('QuestionCtrl', function ($scope, $auth, $service, $timeout,
  question, toastr, $state, moment, $uibModal) {
  $scope.question = question;
  $scope.loading = true;
  var getUser = function () {
    $service.getUser()
      .then(function (res) {
        $scope.user = res.data;
        if ($scope.question.answers.length > 0) {
          listQuestions();
        } else {
          $scope.loading = false;
        }
      })
      .catch(function (err) {
        $timeout(function () {
          $state.go('login');
        });
        console.log(err);
      });
  };
  var listQuestions = function () {
    $scope.question.answers.forEach(function (answer) {
      if (!answer.author.picture) {
        answer.author.picture = '../img/default.png';
      }
    });
    $scope.loading = false;
  };
  getUser();
  listQuestions();

  $scope.openAnswerModal = function () {
    $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'mobal-body',
      templateUrl: 'answerModal.html',
      controller: 'AnswerModalInstanceCtrl',
      size: 'lg',
      scope: $scope,
      backdrop: 'static'
    });
  };

});

app.controller('AnswerModalInstanceCtrl', function ($scope, $uibModalInstance, $service, toastr, $state, moment) {
  $scope.answer = {};

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.submitAnswer = function () {
    if ($scope.answer.content === '') {
      toastr.err("Answer is blank.");
      return;
    } else {
      $scope.answer.author = $scope.user._id;
      $scope.answer.rating = 0;
      $scope.answer.date = moment.now();
      $scope.answer.likes = 0;
      $scope.answer.dislikes = 0;
      $service.addAnswer($scope.question, $scope.answer)
        .then(function (res) {
          $state.reload();
          toastr.success('Your answer has been posted!', 'Success');
        })
        .catch(function (err) {
          console.log(err);
          toastr.error('There was an error when submitting your comment.');
        });
    }
  };
});
