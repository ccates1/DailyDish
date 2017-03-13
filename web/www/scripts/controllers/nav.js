var app = angular.module('dailydish');

app.controller('NavCtrl', function ($scope, $auth, toastr, $state) {
  $(function () {
    $('#navbar-main')
      .on('shown.bs.collapse', function () {
        $('#navbar-hamburger').addClass('hidden');
        $('#navbar-close').removeClass('hidden');
      })
      .on('hidden.bs.collapse', function () {
        $('#navbar-hamburger').removeClass('hidden');
        $('#navbar-close').addClass('hidden');
      });
  });
  
  $scope.isAuthenticated = function () {
    return $auth.isAuthenticated();
  };
  $scope.check = function (state) {
    if (!$auth.isAuthenticated()) {
      toastr.info('Need to sign in to access this application!');
      return;
    } else {
      $state.go(state);
    }
  };
});
