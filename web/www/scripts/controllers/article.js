var app = angular.module('dailydish');

app.controller('ArticleCtrl', function ($scope, $auth, $service, $timeout,
  article, toastr, $state, moment, $uibModal) {
  $scope.article = article;
  console.log(article);
  $scope.loading = true;
  var getUser = function() {
    $service.getUser()
    .then(function(res) {
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
    .catch(function(err) {
      $timeout(function() {
        $state.go('login');
      });
      console.log(err);
    });
  };
  var listComments = function() {
    $scope.article.comments.forEach(function (comment) {
      if(!comment.author.picture) {
        comment.author.picture = '../img/default.png';
      }
    });
    $scope.loading = false;
  };
  getUser();

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
});

app.controller('CommentModalInstanceCtrl', function ($scope, $uibModalInstance, $service, toastr, $state, moment) {
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
});
