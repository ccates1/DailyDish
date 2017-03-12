var app = angular.module('dailydish');

app.controller('NavCtrl', function ($scope, $auth, toastr, $state) {
  $(function () {
    $('.navbar-collapse ul li a:not(.dropdown-toggle)').bind('click touchstart', function () {
            $('.navbar-toggle:visible').click();
    });
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
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
