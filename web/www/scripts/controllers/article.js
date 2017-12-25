var app = angular.module('dailydish');

app.controller('ArticleCtrl', ['$scope', '$auth', '$service', '$timeout', 'toastr', '$state', '$uibModal', 'article', function ($scope, $auth, $service, $timeout, toastr, $state, $uibModal, article) {
  $scope.article = article;
  $scope.loading = true;
  $scope.averageRating = 0;
  $scope.isRated = false;
  $scope.isEmpty = true;
  $scope.stars = '';
  var getUser = function () {
    $service.getUser()
      .then(function (res) {
        $scope.user = res.data;
        if (!$scope.article.author.picture) {
          $scope.article.author.picture = '../img/default.png';
        }
        if (!$scope.user.picture) {
          $scope.user.picture = '../img/default.png';
        }
        if ($scope.article.comments.length > 0) {
          listComments();
        } else {
          $scope.loading = false;
        }
      })
      .catch(function (err) {
        $timeout(function () {
          $state.go('login');
        });
      });
  };
  var listComments = function () {
    $scope.article.comments.forEach(function (comment) {
      if (!comment.author.picture) {
        comment.author.picture = '../img/default.png';
      }
    });
    if ($scope.article.articleRatings.length > 0) {
      $scope.isEmpty = false;
      $scope.article.articleRatings.forEach(function (articleRating) {
        $scope.averageRating += articleRating.rating;
        if (articleRating.user == $scope.user._id) {
          $scope.stars = articleRating.rating;
          $scope.isRated = true;
          $scope.changeStar();
        }
      });
      $scope.averageRating = $scope.averageRating / $scope.article.articleRatings.length;
    }
    $scope.loading = false;
  };
  getUser();

  $scope.getNumber = function () {
    return new Array(Math.round($scope.averageRating));
  };

  $scope.openCommentModal = function () {
    $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'commentModal.html',
      controller: 'CommentModalInstanceCtrl',
      size: 'lg',
      scope: $scope,
      backdrop: 'static'
    });
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

  $scope.rateArticle = function () {
    var data = {};
    var check = false;
    if ($scope.stars === '') {
      toastr.error('No rating was selected!');
      return;
    }
    if ($scope.article.articleRatings.length > 0) {
      $scope.article.articleRatings.forEach(function (articleRating) {
        if (articleRating.user == $scope.user._id) {
          check = true;
        }
      });
      if (check === false) {
        data.rating = $scope.stars;
        data.article = $scope.article._id;
        data.userWhoRated = $scope.user._id;
        $service.submitArticleRating($scope.article, data)
          .then(function (res) {
            toastr.success('Rating was submitted!', 'Success');
            $timeout(function () {
              $scope.$apply();
            });
          })
          .catch(function (err) {
            console.log(err);
            toastr.error('Please try again', 'Error');
          });
      } else {
        toastr.error('You have already rated this article!');
        return;
      }
    } else {
      data.rating = $scope.stars;
      data.article = $scope.article._id;
      data.userWhoRated = $scope.user._id;
      $service.submitArticleRating($scope.article, data)
        .then(function (res) {
          toastr.success('Rating was submitted!', 'Success');
          $state.reload();
        })
        .catch(function (err) {
          console.log(err);
          toastr.error('Please try again', 'Error');
        });
    }
  };

  $scope.addLikeToComment = function (comment) {
    $scope.comment = comment;
    if (comment.likes > 0 && comment.dislikes > 0) {
      // check both usersWhoLiked and usersWhoDisliked lists for user
      if (comment.usersWhoLiked.indexOf($scope.user._id) === -1 && comment.usersWhoDisliked.indexOf($scope.user._id) === -1) {
        // user hasn't liked or disliked the comment OK
        $scope.comment.usersWhoLiked.push($scope.user._id);
        $scope.comment.likes++;
        comment.userWhoLiked = $scope.user._id;
        $service.addLikeCom($scope.article, comment)
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
        // user has liked or disliked the comment ERR
        toastr.error('You can only like or dislike a comment once!', 'Warning');
        return;
      }
    } else if (comment.dislikes > 0) {
      // check usersWhoDisliked list for user
      if (comment.usersWhoDisliked.indexOf($scope.user._id) === -1) {
        // user hasn't disliked the comment OK (usersWhoLiked list is empty)
        $scope.comment.usersWhoLiked.push($scope.user._id);
        $scope.comment.likes++;
        comment.userWhoLiked = $scope.user._id;
        $service.addLikeCom($scope.article, comment)
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
        // user has disliked the comment ERR
        toastr.error('You cant like a comment after disliking it!', 'Warning');
        return;
      }
    } else if (comment.likes > 0) {
      // check usersWhoLiked list for user
      if (comment.usersWhoLiked.indexOf($scope.user._id) === -1) {
        // user hasn't liked the comment OK (usersWhoDisliked list is empty)
        $scope.comment.usersWhoLiked.push($scope.user._id);
        $scope.comment.likes++;
        comment.userWhoLiked = $scope.user._id;
        $service.addLikeCom($scope.article, comment)
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
        // user has liked the comment ERR
        toastr.error('You cant like a comment more than once!', 'Warning');
        return;
      }
    } else {
      // both the usersWhoLiked and usersWhoDisliked lists are empty OK
      $scope.comment.usersWhoLiked.push($scope.user._id);
      $scope.comment.likes++;
      comment.userWhoLiked = $scope.user._id;
      $service.addLikeCom($scope.article, comment)
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

  $scope.addDislikeToComment = function (comment) {
    $scope.comment = comment;
    if (comment.likes > 0 && comment.dislikes > 0) {
      // check both usersWhoLiked and usersWhoDisliked lists for user
      if (comment.usersWhoLiked.indexOf($scope.user._id) === -1 && comment.usersWhoDisliked.indexOf($scope.user._id) === -1) {
        // user hasn't liked or disliked the comment OK
        $scope.comment.usersWhoDisliked.push($scope.user._id);
        $scope.comment.dislikes++;
        comment.userWhoDisliked = $scope.user._id;
        $service.addDislikeCom($scope.article, comment)
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
        // user has liked or disliked the comment ERR
        toastr.error('You can only like or dislike a comment once!', 'Warning');
        return;
      }
    } else if (comment.dislikes > 0) {
      // check usersWhoDisliked list for user
      if (comment.usersWhoDisliked.indexOf($scope.user._id) === -1) {
        // user hasn't disliked the comment OK (usersWhoLiked list is empty)
        $scope.comment.usersWhoDisliked.push($scope.user._id);
        $scope.comment.dislikes++;
        comment.userWhoDisliked = $scope.user._id;
        $service.addDislikeCom($scope.article, comment)
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
        // user has disliked the comment ERR
        toastr.error('You can only dislike a comment once!', 'Warning');
        return;
      }
    } else if (comment.likes > 0) {
      // check usersWhoLiked list for user
      if (comment.usersWhoLiked.indexOf($scope.user._id) === -1) {
        // user hasn't liked the comment OK (usersWhoDisliked list is empty)
        $scope.comment.usersWhoDisliked.push($scope.user._id);
        $scope.comment.dislikes++;
        comment.userWhoDisliked = $scope.user._id;
        $service.addDislikeCom($scope.article, comment)
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
        // user has liked the comment ERR
        toastr.error('You cant dislike a comment after liking it!', 'Warning');
        return;
      }
    } else {
      // both the usersWhoLiked and usersWhoDisliked lists are empty OK
      $scope.comment.usersWhoLiked.push($scope.user._id);
      $scope.comment.usersWhoDisliked.push($scope.user._id);
      $scope.comment.dislikes++;
      comment.userWhoDisliked = $scope.user._id;
      $service.addDislikeCom($scope.article, comment)
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

}]);

app.controller('CommentModalInstanceCtrl', ['$scope', '$uibModalInstance', '$service', 'toastr', '$state', 'moment', function ($scope, $uibModalInstance, $service, toastr, $state, moment) {
  $scope.comment = {};

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.submitComment = function () {
    if ($scope.comment.content === '') {
      toastr.error("Comment is blank.");
      return;
    } else {
      $scope.comment.author = $scope.user._id;
      $scope.comment.article = $scope.article._id;
      $scope.comment.date = moment.now();
      $scope.comment.likes = 0;
      $scope.comment.dislikes = 0;
      $scope.comment.usersWhoLiked = [];
      $scope.comment.usersWhoDisliked = [];
      $service.addComment($scope.article, $scope.comment)
        .then(function (res) {
          $state.reload();
          toastr.success('Your comment has been posted!', 'Success');
        })
        .catch(function (err) {
          console.log(err);
          toastr.error('There was an error when submitting your comment.');
        });
    }
  };
}]);
