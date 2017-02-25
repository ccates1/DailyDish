var app = angular.module('dailydish');

app.controller('DashboardCtrl', function($scope, $auth, $service, $timeout, $uibModal,
  toastr, $state) {
    $scope.userArticles = [];
    $scope.emptyArticleFeed = false;
    $scope.emptyQuestionFeed = false;
    $scope.loading = true;
    $(function() {
      document.getElementById('dashboard').parentElement.className = 'activated';
      $timeout(function() {
        $scope.$apply();
      });
    });

    $scope.$on('$destroy', function() {
      document.getElementById('dashboard').parentElement.className = '';
      $timeout(function() {
        $scope.$apply();
      });
    });
    var getUser = function() {
      $service.getUser()
      .then(function(res) {
        $scope.user = res.data;
        if($scope.user.articles.length > 0) {
          $scope.emptyArticleFeed = true;
        }
        if($scope.user.questions.length === 0) {
          $scope.emptyQuestionFeed = true;
        }
        if(!$scope.user.picture) {
          $scope.user.picture = '../img/default.png';
        }
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

    $scope.open = function() {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'mobal-body',
        templateUrl: 'modalEdit.html',
        controller: 'DashboardModalInstanceCtrl',
        size: 'lg',
        scope: $scope
      });
    };

    $scope.link = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          toastr.success('You have successfully signed in with ' + provider + '!');
          $location.path('/');
        })
        .catch(function(error) {
          if (error.error) {
            // Popup error - invalid redirect_uri, pressed cancel button, etc.
            toastr.error(error.error);
          } else if (error.data) {
            // HTTP response error from server
            toastr.error(error.data.message, error.status);
          } else {
            toastr.error(error);
          }
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
      .then(function() {
        toastr.info('You have unlinked a ' + provider + ' account');
        getUser();
      })
      .catch(function(response) {
        toastr.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
      });
    };

  });

  app.controller('DashboardModalInstanceCtrl', function($scope, $uibModalInstance) {
    console.log($scope.user);

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
