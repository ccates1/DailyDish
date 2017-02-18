var app = angular.module('dailydish');

app.controller('DashboardCtrl', function($scope, $auth, $service, $timeout,
    toastr, $state) {
    $scope.userArticles = [];
    $scope.emptyArticleFeed = false;
    $scope.emptyQuestionFeed = false;
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
