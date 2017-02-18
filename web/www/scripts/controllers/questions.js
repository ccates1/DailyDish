var app = angular.module('dailydish');

app.controller('QuestionsCtrl', function($scope, $auth, $service, $timeout,
    toastr, $state) {
    $(function() {
        document.getElementById('questions').parentElement.className = 'activated';
        $timeout(function() {
            $scope.$apply();
        });
    });
    $scope.$on('$destroy', function() {
        document.getElementById('questions').parentElement.className = '';
        $timeout(function() {
            $scope.$apply();
        });
    });

    var getUser = function() {
        $service.getUser()
            .then(function(res) {
                $scope.user = res.data;
            })
            .catch(function(err) {
                $timeout(function() {
                    $state.go('login');
                });
                console.log(err);
            });
    };
    getUser();

})
