var app = angular.module('dailydish');

app.controller('NavCtrl', function($scope, $auth, toastr, $state) {
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };
    $scope.check = function(state) {
        if (!$auth.isAuthenticated()) {
            toastr.info('Need to sign in to access this application!');
            return;
        } else {
            $state.go(state);
        }
    };
});
