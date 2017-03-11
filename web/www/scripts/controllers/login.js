var app = angular.module('dailydish');

app.controller('LoginCtrl', function ($scope, $auth, $timeout, $state, toastr) {
  $(function () {
    document.getElementById('login').parentElement.className = 'activated';
    $timeout(function () {
      $scope.$apply();
    });
  });
  $scope.$on('$destroy', function () {
    document.getElementById('login').parentElement.className = '';
    $timeout(function () {
      $scope.$apply();
    });
  });

  $(function () {
    $('#login-form-link').click(function (e) {
      $("#login-form").delay(100).fadeIn(100);
      $("#register-form").fadeOut(100);
      $('#register-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
      $("#register-form").delay(100).fadeIn(100);
      $("#login-form").fadeOut(100);
      $('#login-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
  });

  $scope.login = function () {
    $auth.login($scope.user)
      .then(function () {
        toastr.success('Login Success');
        $timeout(function () {
          $state.go('dashboard');
        });
      })
      .catch(function (err) {
        toastr.error(err.data.message, 'Error');
        console.log(err);
      });
  };

  $scope.register = function () {
    if ($scope.user.password !== $scope.user.confirmPassword) {
      toastr.warning('Passwords do not match!', 'Warning');
      return;
    } else {
      $auth.signup($scope.user)
        .then(function (res) {
          toastr.success('You have been registered!', 'Success');
          $auth.setToken(res);
          $timeout(function () {
            $state.go('dashboard');
          });
        })
        .catch(function (err) {
          toastr.error(err.data.message, 'Error');
          console.log(err.data.message);
        });
    }
  };

});
