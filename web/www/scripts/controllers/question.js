(function () {
    "use strict";
    var app = angular.module('dailydish');

    app.controller('QuestionCtrl', ['$scope', '$auth', '$service', '$timeout', 'toastr', '$state', '$uibModal', '$rootScope', 'question', function ($scope, $auth, $service, $timeout, toastr, $state, $uibModal, $rootScope, question) {
        $scope.question = question;
        $scope.sportImg = '';
        $scope.loading = true;
        $scope.isAuthor = false;
        $scope.isEmpty = false;


        var getUser = function () {
            $service.getUser()
                .then(function (res) {
                    var user = $scope.user = res.data;

                    var questionAuthor = $scope.question.author || {};

                    if (questionAuthor._id === user._id) {
                        $scope.isAuthor = true;
                    }
                    if (!questionAuthor.picture) {
                        $scope.question.author.picture = '../img/default.png';
                    }
                    if (!user.picture) {
                        $scope.user.picture = '../img/default.png';
                    }
                    listQuestions();
                })
                .catch(function (err) {
                    // $state.go('login');
                    $scope.user = {};
                    var questionAuthor = $scope.question.author || {};
                    if (!questionAuthor.picture) {
                        $scope.question.author.picture = '../img/default.png';
                    }
                    listQuestions();
                });
        };

        var listQuestions = function () {

          var question = $scope.question;

          var answers = question.answers || [];

          _.each(answers, function (answer) {
              answer.toggle = false;
              answer.isEmpty = false;
              if (!answer.author.picture) {
                  answer.author.picture = '../img/default.png';
              }
              if (answer.rating === 0) {
                  answer.isEmpty = true;
              }
          })

            if (question.sport === 'NBA') {
                $scope.sportImg = '../img/nba.png';
            }
            if (question.sport === 'MLB') {
                $scope.sportImg = '../img/mlb.png';
            }
            if (question.sport === 'NFL') {
                $scope.sportImg = '../img/nfl.png';
            }
            $scope.loading = false;
        };

        getUser();

        $scope.addLikeToAnswer = function (answer) {
            if(!$scope.user || _.isEmpty($scope.user)) {
                toastr.error('Please login to perform this action!');
                return;
            }

            $scope.answer = answer;
            if (answer.likes > 0 && answer.dislikes > 0) {
                // check both usersWhoLiked and usersWhoDisliked lists for user
                if (answer.usersWhoLiked.indexOf($scope.user._id) === -1 && answer.usersWhoDisliked.indexOf($scope.user._id) === -1) {
                    // user hasn't liked or disliked the answer OK
                    $scope.answer.usersWhoLiked.push($scope.user._id);
                    $scope.answer.likes++;
                    answer.userWhoLiked = $scope.user._id;
                    $service.addLikeAns($scope.question, answer)
                        .then(function (res) {
                            $timeout(function () {
                                $scope.$apply();
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                            toastr.error('Please try again', 'Error');
                        });
                } else {
                    // user has liked or disliked the answer ERR
                    toastr.error('You can only like or dislike a answer once!', 'Warning');
                    return;
                }
            } else if (answer.dislikes > 0) {
                // check usersWhoDisliked list for user
                if (answer.usersWhoDisliked.indexOf($scope.user._id) === -1) {
                    // user hasn't disliked the answer OK (usersWhoLiked list is empty)
                    $scope.answer.usersWhoLiked.push($scope.user._id);
                    $scope.answer.likes++;
                    answer.userWhoLiked = $scope.user._id;
                    $service.addLikeAns($scope.question, answer)
                        .then(function (res) {
                            $timeout(function () {
                                $scope.$apply();
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                            toastr.error('Please try again', 'Error');
                        });
                } else {
                    // user has disliked the answer ERR
                    toastr.error("You can't like a answer after disliking it!", 'Warning');
                    return;
                }
            } else if (answer.likes > 0) {
                // check usersWhoLiked list for user
                if (answer.usersWhoLiked.indexOf($scope.user._id) === -1) {
                    // user hasn't liked the answer OK (usersWhoDisliked list is empty)
                    $scope.answer.usersWhoLiked.push($scope.user._id);
                    $scope.answer.likes++;
                    answer.userWhoLiked = $scope.user._id;
                    $service.addLikeAns($scope.question, answer)
                        .then(function (res) {
                            $timeout(function () {
                                $scope.$apply();
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                            toastr.error('Please try again', 'Error');
                        });
                } else {
                    // user has liked the answer ERR
                    toastr.error("You can't like a answer more than once!", 'Warning');
                    return;
                }
            } else {
                // both the usersWhoLiked and usersWhoDisliked lists are empty OK
                $scope.answer.usersWhoLiked.push($scope.user._id);
                $scope.answer.likes++;
                answer.userWhoLiked = $scope.user._id;
                $service.addLikeAns($scope.question, answer)
                    .then(function (res) {
                        $timeout(function () {
                            $scope.$apply();
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        };

        $scope.addDislikeToAnswer = function (answer) {
            if(!$scope.user || _.isEmpty($scope.user)) {
                toastr.error('Please login to perform this action!');
                return;
            }
            $scope.answer = answer;
            if (answer.likes > 0 && answer.dislikes > 0) {
                // check both usersWhoLiked and usersWhoDisliked lists for user
                if (answer.usersWhoLiked.indexOf($scope.user._id) === -1 && answer.usersWhoDisliked.indexOf($scope.user._id) === -1) {
                    // user hasn't liked or disliked the answer OK
                    $scope.answer.usersWhoDisliked.push($scope.user._id);
                    $scope.answer.dislikes++;
                    answer.userWhoDisliked = $scope.user._id;
                    $service.addDislikeAns($scope.question, answer)
                        .then(function (res) {
                            $timeout(function () {
                                $scope.$apply();
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                            toastr.error('Please try again', 'Error');
                        });
                } else {
                    // user has liked or disliked the answer ERR
                    toastr.error('You can only like or dislike a answer once!', 'Warning');
                    return;
                }
            } else if (answer.dislikes > 0) {
                // check usersWhoDisliked list for user
                if (answer.usersWhoDisliked.indexOf($scope.user._id) === -1) {
                    // user hasn't disliked the answer OK (usersWhoLiked list is empty)
                    $scope.answer.usersWhoDisliked.push($scope.user._id);
                    $scope.answer.dislikes++;
                    answer.userWhoDisliked = $scope.user._id;
                    $service.addDislikeAns($scope.question, answer)
                        .then(function (res) {
                            $timeout(function () {
                                $scope.$apply();
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                            toastr.error('Please try again', 'Error');
                        });
                } else {
                    // user has disliked the answer ERR
                    toastr.error('You can only dislike a answer once!', 'Warning');
                    return;
                }
            } else if (answer.likes > 0) {
                // check usersWhoLiked list for user
                if (answer.usersWhoLiked.indexOf($scope.user._id) === -1) {
                    // user hasn't liked the answer OK (usersWhoDisliked list is empty)
                    $scope.answer.usersWhoDisliked.push($scope.user._id);
                    $scope.answer.dislikes++;
                    answer.userWhoDisliked = $scope.user._id;
                    $service.addDislikeAns($scope.question, answer)
                        .then(function (res) {
                            $timeout(function () {
                                $scope.$apply();
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                            toastr.error('Please try again', 'Error');
                        });
                } else {
                    // user has liked the answer ERR
                    toastr.error("You can't dislike a answer after liking it!", 'Warning');
                    return;
                }
            } else {
                // both the usersWhoLiked and usersWhoDisliked lists are empty OK
                $scope.answer.usersWhoDisliked.push($scope.user._id);
                $scope.answer.dislikes++;
                answer.userWhoDisliked = $scope.user._id;
                $service.addDislikeAns($scope.question, answer)
                    .then(function (res) {
                        $timeout(function () {
                            $scope.$apply();
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                        toastr.error('Please try again', 'Error');
                    });
            }
        };

        $scope.flagAnswer = function (answer) {
            if(!$scope.user || _.isEmpty($scope.user)) {
                toastr.error('Please login to perform this action!');
                return;
            }
            if (answer.usersWhoFlagged.indexOf($scope.user._id) === -1) {
                answer.usersWhoFlagged.push($scope.user._id);
                answer.flags++;
                answer.userWhoFlagged = $scope.user._id;
                $service.addFlagAns($scope.question, answer)
                    .then(function (res) {
                        toastr.success('Answer has been successfully flagged!', 'Thanks');
                        $timeout(function () {
                            $scope.$apply();
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                        toastr.error('Please try again', 'Error');
                    });
            } else {
                toastr.error('You can only flag an answer once!');
            }
        };

        $scope.checkIfRated = function (answer) {
            if (answer.rating === 0) {
                return true;
            } else {
                return false;
            }
        };

        $scope.getNumber = function (rating) {
            return new Array(rating);
        };

        $scope.openAnswerModal = function () {
            if(!$scope.user || _.isEmpty($scope.user)) {
                toastr.error('Please login to perform this action!');
                return;
            }
            if ($scope.isAuthor === true) {
                toastr.error("You can't answer your own question!", "Warning");
                return;
            } else {
                $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'answerModal.html',
                    controller: 'AnswerModalInstanceCtrl',
                    size: 'lg',
                    scope: $scope,
                    backdrop: 'static'
                });
            }
        };

        $scope.openRatingModal = function (answer) {
            if(!$scope.user || _.isEmpty($scope.user)) {
                toastr.error('Please login to perform this action!');
                return;
            }
            $scope.ratingAnswer = answer;
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'ratingModal.html',
                controller: 'RatingModalInstanceCtrl',
                size: 'lg',
                scope: $scope,
                backdrop: 'static'
            });
        };

    }]);

    app.controller('RatingModalInstanceCtrl', ['$scope', '$uibModalInstance', '$service', 'toastr', '$state', 'momment', function ($scope, $uibModalInstance, $service, toastr, $state, moment) {
        $scope.stars = '';
        $scope.answer = {};

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.changeStar = function () {
            var result = '';
            if ($scope.stars == '1') {
                result = '<i class="text-danger-dark fa fa-frown-o fa-5x"></i>' +
                    '<br />' +
                    '<h3 class="text-danger-dark cancel-margin">Poor</h3>';
            }
            if ($scope.stars == '2') {
                result = '<i class="text-warning-dark fa fa-frown-o fa-5x"></i>' +
                    '<br />' +
                    '<h3 class="text-warning-dark cancel-margin">Below Average</h3>';
            }
            if ($scope.stars == '3') {
                result = '<i class="fa fa-meh-o fa-5x"></i>' +
                    '<br />' +
                    '<h3 class="text-q cancel-margin">Average</h3>';
            }
            if ($scope.stars == '4') {
                result = '<i class="text-info fa fa-smile-o fa-5x"></i>' +
                    '<br />' +
                    '<h3 class="text-info cancel-margin">Above Average</h3>';
            }
            if ($scope.stars == '5') {
                result = '<i class="text-success fa fa-smile-o fa-5x"></i>' +
                    '<br />' +
                    '<h3 class="text-success-dark cancel-margin">Excellent</h3>';
            }
            document.getElementById('starContext').innerHTML = result;
        };

        $scope.submitRating = function () {
            if ($scope.stars === "") {
                toastr.error('Please select a rating to give for the answer!', "Warning");
                return;
            } else if ($scope.ratingAnswer.rating !== 0) {
                toastr.error('You can only submit one rating per answer!', "Warning");
                return;
            } else {
                $scope.ratingAnswer.rating = $scope.stars;
                $service.rateAnswer($scope.question, $scope.ratingAnswer)
                    .then(function (res) {
                        $state.reload();
                        toastr.success('The rating has been submitted!');
                    })
                    .catch(function (err) {
                        console.log(err);
                        toastr.error('There was an error when submitting your rating.');
                    });
            }
        };


    }]);

    app.controller('AnswerModalInstanceCtrl', ['$scope', '$uibModalInstance', '$service', 'toastr', '$state', 'moment', function ($scope, $uibModalInstance, $service, toastr, $state, moment) {
        $scope.answer = {};

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.submitAnswer = function () {
            if ($scope.answer.content === '') {
                toastr.error("Answer is blank.");
                return;
            } else {
                $scope.answer.author = $scope.user._id;
                $scope.answer.question = $scope.question._id;
                $scope.answer.rating = 0;
                $scope.answer.date = moment.now();
                $scope.answer.likes = 0;
                $scope.answer.dislikes = 0;
                $scope.answer.flags = 0;
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
    }]);
})();