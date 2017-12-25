(function() {
    "use strict";
    var app = angular.module('dailydish');

    app.controller('LogoutCtrl', ['$scope', '$auth', '$timeout', '$state', function ($scope, $auth, $timeout, $state) {
        $auth.logout()
            .then(function () {
                $state.go('login');
            })
            .catch(function (err) {
                console.log(err);
            });
    }]);
})();
