var app = angular.module('dailydish');

app.controller('QuestionCtrl', function ($scope, $auth, $service, $timeout,
  question, toastr, $state, moment, $uibModal) {
  $scope.question = question;
  $scope.loading = true;
  var getUser = function () {
    $service.getUser()
      .then(function (res) {
        $scope.user = res.data;
        if (!$scope.question.author.picture) {
          $scope.question.author.picture = '../img/default.png';
        }
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

  $scope.addLikeToAnswer = function(answer) {
    $scope.answer = answer;
    if(answer.likes > 0 && answer.dislikes > 0) {
      // check both usersWhoLiked and usersWhoDisliked lists for user
      if(answer.usersWhoLiked.indexOf($scope.user._id) === -1 && answer.usersWhoDisliked.indexOf($scope.user._id) === -1) {
        // user hasn't liked or disliked the answer OK
        $scope.answer.usersWhoLiked.push($scope.user._id);
        $scope.answer.likes++;
        answer.userWhoLiked = $scope.user._id;
        $service.addLike($scope.question, answer)
          .then(function(res) {
            $timeout(function() {
              $scope.$apply();
            });
          })
          .catch(function(err) {
            console.log(err);
            toastr.error('Please try again', 'Error');
          });
      } else {
        // user has liked or disliked the answer ERR
        toastr.error('You can only like or dislike an answer once!', 'Error');
        return;
      }
    } else if(answer.dislikes > 0) {
      // check usersWhoDisliked list for user
      if(answer.usersWhoDisliked.indexOf($scope.user._id) === -1) {
        // user hasn't disliked the answer OK (usersWhoLiked list is empty)
        $scope.answer.usersWhoLiked.push($scope.user._id);
        $scope.answer.likes++;
        answer.userWhoLiked = $scope.user._id;
        $service.addLike($scope.question, answer)
          .then(function(res) {
            $timeout(function() {
              $scope.$apply();
            });
          })
          .catch(function(err) {
            console.log(err);
            toastr.error('Please try again', 'Error');
          });
      } else {
        // user has disliked the answer ERR
        toastr.error('You cant like an answer after disliking it!', 'Error');
        return;
      }
    } else if(answer.likes > 0) {
      // check usersWhoLiked list for user
      if(answer.usersWhoLiked.indexOf($scope.user._id) === -1) {
        // user hasn't liked the answer OK (usersWhoDisliked list is empty)
        $scope.answer.usersWhoLiked.push($scope.user._id);
        $scope.answer.likes++;
        answer.userWhoLiked = $scope.user._id;
        $service.addLike($scope.question, answer)
          .then(function(res) {
            $timeout(function() {
              $scope.$apply();
            });
          })
          .catch(function(err) {
            console.log(err);
            toastr.error('Please try again', 'Error');
          });
      } else {
        // user has liked the answer ERR
        toastr.error('You cant like an answer more than once!', 'Error');
        return;
      }
    } else {
      // both the usersWhoLiked and usersWhoDisliked lists are empty OK
      $scope.answer.usersWhoLiked.push($scope.user._id);
      $scope.answer.likes++;
      answer.userWhoLiked = $scope.user._id;
      $service.addLike($scope.question, answer)
        .then(function(res) {
          console.log(res);
          $timeout(function() {
            $scope.$apply();
          });
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  };

  $scope.addDislikeToAnswer = function(answer) {
    $scope.answer = answer;
    if(answer.likes > 0 && answer.dislikes > 0) {
      // check both usersWhoLiked and usersWhoDisliked lists for user
      if(answer.usersWhoLiked.indexOf($scope.user._id) === -1 && answer.usersWhoDisliked.indexOf($scope.user._id) === -1) {
        // user hasn't liked or disliked the answer OK
        $scope.answer.usersWhoDisliked.push($scope.user._id);
        $scope.answer.dislikes++;
        answer.userWhoDisliked = $scope.user._id;
        $service.addDislike($scope.question, answer)
          .then(function(res) {
            $timeout(function() {
              $scope.$apply();
            });
          })
          .catch(function(err) {
            console.log(err);
            toastr.error('Please try again', 'Error');
          });
      } else {
        // user has liked or disliked the answer ERR
        toastr.error('You can only like or dislike an answer once!', 'Error');
        return;
      }
    } else if(answer.dislikes > 0) {
      // check usersWhoDisliked list for user
      if(answer.usersWhoDisliked.indexOf($scope.user._id) === -1) {
        // user hasn't disliked the answer OK (usersWhoLiked list is empty)
        $scope.answer.usersWhoDisliked.push($scope.user._id);
        $scope.answer.dislikes++;
        answer.userWhoDisliked = $scope.user._id;
        $service.addDislike($scope.question, answer)
          .then(function(res) {
            $timeout(function() {
              $scope.$apply();
            });
          })
          .catch(function(err) {
            console.log(err);
            toastr.error('Please try again', 'Error');
          });
      } else {
        // user has disliked the answer ERR
        toastr.error('You can only dislike an answer once!', 'Error');
        return;
      }
    } else if(answer.likes > 0) {
      // check usersWhoLiked list for user
      if(answer.usersWhoLiked.indexOf($scope.user._id) === -1) {
        // user hasn't liked the answer OK (usersWhoDisliked list is empty)
        $scope.answer.usersWhoDisliked.push($scope.user._id);
        $scope.answer.dislikes++;
        answer.userWhoDisliked = $scope.user._id;
        $service.addDislike($scope.question, answer)
          .then(function(res) {
            $timeout(function() {
              $scope.$apply();
            });
          })
          .catch(function(err) {
            console.log(err);
            toastr.error('Please try again', 'Error');
          });
      } else {
        // user has liked the answer ERR
        toastr.error('You cant dislike an answer after liking it!', 'Error');
        return;
      }
    } else {
      // both the usersWhoLiked and usersWhoDisliked lists are empty OK
      $scope.answer.usersWhoLiked.push($scope.user._id);
      $scope.answer.usersWhoDisliked.push($scope.user._id);
      $scope.answer.dislikes++;
      answer.userWhoDisliked = $scope.user._id;
      $service.addDislike($scope.question, answer)
        .then(function(res) {
          $timeout(function() {
            $scope.$apply();
          });
        })
        .catch(function(err) {
          console.log(err);
          toastr.error('Please try again', 'Error');
        });
    }
  };

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
      $scope.answer.question = $scope.question._id;
      $scope.answer.rating = 0;
      $scope.answer.date = moment.now();
      $scope.answer.likes = 0;
      $scope.answer.dislikes = 0;
      $scope.answer.usersWhoLiked = [];
      $scope.answer.usersWhoDisliked = [];
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
