var app = angular.module('dailydish');

app.controller('QuestionsCtrl', function ($scope, $auth, $service, $timeout,
  toastr, $state, $uibModal, moment) {
    $(function() {
      $("[rel='tooltip']").tooltip({
        delay: { "show": 500, "hide": 100 }
      });
    });
  $scope.articles = [];
  $scope.nba = [];
  $scope.mlb = [];
  $scope.nfl = [];
  $scope.loading = true;
  $scope.categories = [{
      icon: "<img src='./img/icons/nba.ico'>",
      name: "NBA",
      ticked: false
            },
    {
      icon: "<img src='./img/icons/mlb.ico'>",
      name: "MLB",
      ticked: false
            },
    {
      icon: "<img src='./img/icons/nfl.ico'>",
      name: "NFL",
      ticked: false
            }
        ];

  $(function () {
    document.getElementById('questions').parentElement.className = 'activated';
    $timeout(function () {
      $scope.$apply();
    });
    $('#btn-q-2').on('click', function() {
      $(this).removeClass('btn-outline-primary').addClass('btn-primary');
      $('#btn-q-1').removeClass('btn-primary').addClass('btn-outline-primary');
    });
    $('#btn-q-1').on('click', function() {
      $(this).removeClass('btn-outline-primary').addClass('btn-primary');
      $('#btn-q-2').removeClass('btn-primary').addClass('btn-outline-primary');
    });
  });
  $scope.$on('$destroy', function () {
    document.getElementById('questions').parentElement.className = '';
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
  var getQuestions = function () {
    $service.questionsList()
      .then(function (res) {
        console.log(res);
        $scope.questions = res.data;
        if ($scope.questions) {
          $scope.questions.forEach(function (question) {
            if (question.sport === 'NBA') {
              $scope.nba.push(question);
            } else if (question.sport === 'MLB') {
              $scope.mlb.push(question);
            } else if (question.sport === 'NFL') {
              $scope.nfl.push(question);
            } else {
              console.log('WTF?');
            }
            if (!question.author.picture) {
              question.author.picture = '../img/default.png';
            }
          });
          $scope.loading = false;
        }
      })
      .catch(function (err) {
        $scope.loading = false;
        console.log(err);
      });
    $timeout(function () {
      $scope.$apply();
    });
  };
  getUser();
  getQuestions();

  $scope.openQuestionModal = function () {
    $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'mobal-body',
      templateUrl: 'questionModal.html',
      controller: 'QuestionModalInstanceCtrl',
      size: 'lg',
      scope: $scope,
      backdrop: 'static'
    });
  };
});

app.controller('QuestionModalInstanceCtrl', function ($scope, $uibModalInstance, $service, toastr, $state, moment) {
  $scope.tagOutput = [];
  $scope.error = false;
  $scope.dfs = false;

  $(function () {
    $('#dfs1').on('click', function() {
      $(this).removeClass('btn-outline-primary').addClass('btn-primary');
      $('#dfs2').removeClass('btn-primary').addClass('btn-outline-primary');
      $('#fa1').removeClass('hide');
      $('#fa2').addClass('hide');
    });
    $('#dfs2').on('click', function() {
      $(this).removeClass('btn-outline-primary').addClass('btn-primary');
      $('#dfs1').removeClass('btn-primary').addClass('btn-outline-primary');
      $('#fa2').removeClass('hide');
      $('#fa1').addClass('hide');
    });
  });
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.submit = function (question) {
    if ($scope.tagOutput.length > 0) {
      $scope.question.sport = $scope.tagOutput[0].name;
      $scope.question.author = $scope.user._id;
      $scope.question.date = moment.now();
      if($scope.dfs === true) {
        $scope.question.dailyFantasy = true;
      } else {
        $scope.question.dailyFantasy = false;
      }
      $service.submitQuestion($scope.question)
        .then(function (res) {
          $uibModalInstance.dismiss('cancel');
          toastr.success('Your question has been posted!', 'Success');
          $state.reload();
        })
        .catch(function (err) {
          $uibModalInstance.dismiss('cancel');
          console.log(err);
          toastr.error('There was a problem and your question was not submitted.', 'Error');
        });
    } else {
      toastr.warning('Please select a sport for your question', 'Warning');
    }
  };
});
