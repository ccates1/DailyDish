var app = angular.module('dailydish');

app.controller('DashboardCtrl', function ($scope, $auth, $service, $timeout, $uibModal,
  toastr, $state) {
  $scope.userArticles = [];
  $scope.comment = '';
  $scope.loading = true;
  var nbaPic = '../img/nba.png';
  $(function () {
    document.getElementById('dashboard').parentElement.className = 'activated';
    $timeout(function () {
      $scope.$apply();
    });
  });

  $scope.$on('$destroy', function () {
    document.getElementById('dashboard').parentElement.className = '';
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
          if (!$scope.user.picture) {
            $scope.user.picture = '../img/default.png';
          }
          if ($scope.user.questions.length) {
            $scope.user.questions.forEach(function (question) {
              if (question.sport === 'NBA') {
                question.img = "../img/icons/nba.ico";
              }
              if (question.sport === 'MLB') {
                question.img = "../img/icons/mlb.ico";
              }
              if (question.sport === 'NFL') {
                question.img = "../img/icons/nfl.ico";
              }
            });
          }
          $scope.loading = false;
        }
      })
      .catch(function (err) {
        $timeout(function () {
          $state.go('login');
        });
      });
  };
  getUser();

  $scope.open = function () {
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

  $scope.link = function (provider) {
    $auth.authenticate(provider)
      .then(function () {
        toastr.success('You have successfully signed in with ' + provider + '!');
        $state.reload();
      })
      .catch(function (error) {
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

  $scope.unlink = function (provider) {
    $auth.unlink(provider)
      .then(function () {
        toastr.info('You have unlinked a ' + provider + ' account');
        getUser();
      })
      .catch(function (response) {
        toastr.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
      });
  };
});

app.controller('DashboardModalInstanceCtrl', function ($scope, $uibModalInstance, filepickerService) {
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.upload = function () {
    filepickerService.pick({
        mimetype: 'image/*',
        language: 'en',
        services: ['COMPUTER', 'FACEBOOK'],
        openTo: 'COMPUTER',
        container: 'window',
        maxSize: '1048576'
      },
      function (Blob) {
        console.log(JSON.stringify(Blob));
        $scope.user.picture = Blob;
        $scope.$apply();
      }
    );
  };
});
