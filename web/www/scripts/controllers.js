angular.module('dailydish.controllers', ['satellizer', 'ngAnimate', 'toastr'])
.controller('LoginCtrl', function($scope, $auth, toastr, $state, $timeout) {

  $(function() {
    $('#login-form-link').click(function(e) {
      $("#login-form").delay(100).fadeIn(100);
      $("#register-form").fadeOut(100);
      $('#register-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
      $("#register-form").delay(100).fadeIn(100);
      $("#login-form").fadeOut(100);
      $('#login-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
  });

  $scope.login = function() {
    $auth.login($scope.user)
      .then(function() {
        toastr.success('Login Success');
        $timeout(function() {
          $state.go('dashboard');
        });
      })
      .catch(function(err) {
        toastr.error(err.data.message, err.status);
        console.log(err);
      });
  };

  $scope.register = function() {
    console.log('test');
    $auth.signup($scope.user)
      .then(function(res) {
        toastr.success('Login Success');
        $auth.setToken(res);
        $timeout(function() {
          $state.go('dashboard');
        });
      })
      .catch(function(err) {
        toastr.error(err.data.message, err.status);
        console.log(err.data.message);
      });
  };

})
.controller('DashboardCtrl', function($scope) {

})
.controller('ArticlesCtrl', function($scope) {

})
.controller('QuestionsCtrl', function($scope) {

});
