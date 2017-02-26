var app = angular.module('dailydish');

app.controller('QuestionsCtrl', function($scope, $auth, $service, $timeout,
    toastr, $state, $uibModal) {
      $scope.articles = [];
      $scope.nba = [];
      $scope.mlb = [];
      $scope.nfl = [];
      $scope.loading = true;
      $scope.categories = [{
          icon: "<img src='./img/nba.png'>",
          name: "NBA",
          ticked: false
            },
        {
          icon: "<img src='./img/mlb.png'>",
          name: "MLB",
          ticked: false
            },
        {
          icon: "<img src='./img/nfl.png'>",
          name: "NFL",
          ticked: false
            }
        ];

    $(function() {
        document.getElementById('questions').parentElement.className = 'activated';
        $timeout(function() {
            $scope.$apply();
        });
    });
    $scope.$on('$destroy', function() {
        document.getElementById('questions').parentElement.className = '';
        $timeout(function() {
            $scope.$apply();
        });
    });

    var getUser = function() {
        $service.getUser()
            .then(function(res) {
                $scope.user = res.data;
            })
            .catch(function(err) {
                $timeout(function() {
                    $state.go('login');
                });
                console.log(err);
            });
    };
    getUser();

    var getQuestions = function() {
      $service.questionsList()
        .then(function(res) {
          console.log(res);
          $scope.questions = res.data;
          if($scope.questions) {
            $scope.questions.forEach(function(question) {
              if(question.sport === 'NBA') {
                $scope.nba.push(question);
              } else if(question.sport === 'MLB') {
                $scope.mlb.push(question);
              } else if(question.sport === 'NFL') {
                $scope.nfl.push(question);
              } else {
                console.log('WTF?');
              }
            });
            $scope.loading = false;
          }
        })
        .catch(function(err) {
          $scope.loading = false;
          console.log(err);
        });
        $timeout(function() {
          $scope.$apply();
        });
    };
    getQuestions();

    $scope.openQuestionModal = function() {
      $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'mobal-body',
        templateUrl: 'questionModal.html',
        controller: 'QuestionModalInstanceCtrl',
        size: 'sm',
        scope: $scope,
        backdrop: 'static'
      });
    };
});

app.controller('QuestionModalInstanceCtrl', function($scope, $uibModalInstance, $service, toastr, $state, moment) {
  $scope.tagOutput = [];
  $scope.error = false;

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.submit = function(question) {
    if($scope.tagOutput.length > 0) {
      $scope.question.sport = $scope.tagOutput[0].name;
      $scope.question.author = $scope.user._id;
      $scope.question.date = moment.now();
      $service.submitQuestion($scope.question)
        .then(function(res) {
          $uibModalInstance.dismiss('cancel');
          toastr.success('Your question has been posted!', 'Success');
          $state.reload();
        })
        .catch(function(err) {
          $uibModalInstance.dismiss('cancel');
          console.log(err);
          toastr.error('There was a problem and your question was not submitted.', 'Error');
        });
    } else {
      $scope.error = true;
    }
  };
});
