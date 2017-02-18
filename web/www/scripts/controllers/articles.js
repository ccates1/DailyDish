var app = angular.module('dailydish');

app.controller('ArticlesCtrl', function($scope, $auth, $service, $timeout,
    toastr, $state) {
    $(function() {
        document.getElementById('articles').parentElement.className = 'activated';
        $timeout(function() {
            $scope.$apply();
        });
    });
    $scope.$on('$destroy', function() {
        document.getElementById('articles').parentElement.className = '';
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

    var getArticles = function() {
        $service.articlesList()
            .then(function(res) {
                $scope.articles = res.data;
                console.log($scope.articles);
            })
            .catch(function(err) {
                console.log(err);
            });
    };
    getArticles();

});
