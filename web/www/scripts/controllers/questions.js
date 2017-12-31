(function () {
    "use strict";

    var app = angular.module('dailydish');

    app.controller('QuestionsCtrl', ['$scope', '$auth', '$service', '$timeout', 'toastr', '$state', '$uibModal', function ($scope, $auth, $service, $timeout, toastr, $state, $uibModal) {

        $("[rel='tooltip']").tooltip({
            delay: {"show": 500, "hide": 100}
        });

        $scope.articles = [];
        $scope.nba = [];
        $scope.mlb = [];
        $scope.nfl = [];
        $scope.loading = true;
        $scope.categories = [
            {
                icon: "<img src='./img/icons/nba.ico'>",
                name: "NBA",
                ticked: false
            },
            {
                icon: "<img src='./img/icons/mlb.ico'>",
                name: "MLB",
                ticked: false
            },
            {
                icon: "<img src='./img/icons/nfl.ico'>",
                name: "NFL",
                ticked: false
            }
        ];

        var getUser = function () {
            debugger;
            $service.getUser()
                .then(function (res) {

                    // if (res.data === "") {
                    //     $auth.logout();
                    //     $state.go('login');
                    // } else {
                    //     $scope.user = res.data;
                    //     getQuestions();
                    // }

                    $scope.user = res.data || {};
                    getQuestions();
                })
                .catch(function (err) {
                    $scope.user = {};
                    getQuestions();
                });
        };

        var getQuestions = function () {
            $service.questionsList()
                .then(function (res) {
                    var questions = $scope.questions = res.data;

                    _.each(questions, function (question) {
                        question.intdate = parseFloat(question.date);
                        if (question.sport === 'NBA') {
                            $scope.nba.push(question);
                        } else if (question.sport === 'MLB') {
                            $scope.mlb.push(question);
                        } else if (question.sport === 'NFL') {
                            $scope.nfl.push(question);
                        }
                        if (!question.author.picture) {
                            question.author.picture = '../img/default.png';
                        }
                    })

                    $scope.loading = false;
                })
                .catch(function (err) {
                    $scope.loading = false;
                    console.log(err);
                });
        };
        getUser();

        $scope.openQuestionModal = function () {
            if(!$scope.user || _.isEmpty($scope.user)) {
                toastr.error('Please login to perform this action!');
                return;
            }
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'mobal-body',
                templateUrl: 'questionModal.html',
                controller: 'QuestionModalInstanceCtrl',
                size: 'lg',
                scope: $scope,
                backdrop: 'static'
            });
        };
    }]);

    app.controller('QuestionModalInstanceCtrl', ['$scope', '$uibModalInstance', '$service', 'toastr', '$state', 'moment', function ($scope, $uibModalInstance, $service, toastr, $state, moment) {
        $scope.tagOutput = [];
        $scope.error = false;
        $scope.dfs = false;


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.submit = function (q) {
            var question = $scope.question || q || {};

            if ($scope.tagOutput.length > 0) {
                question.sport = $scope.tagOutput[0].name;
                question.author = $scope.user._id;
                question.date = moment.now();
                if ($scope.dfs === true) {
                    question.dailyFantasy = true;
                } else {
                    question.dailyFantasy = false;
                }
                $service.submitQuestion(question)
                    .then(function (res) {
                        $uibModalInstance.dismiss('cancel');
                        toastr.success('Your question has been posted!', 'Success');
                        $state.reload();
                    })
                    .catch(function (err) {
                        $uibModalInstance.dismiss('cancel');
                        console.log(err);
                        toastr.error('There was a problem and your question was not submitted.', 'Error');
                    });
            } else {
                toastr.warning('Please select a sport for your question', 'Warning');
            }
        };
    }]);

    app.filter('orderObjectBy', function () {
        return function (input, attribute) {
            if (!angular.isObject(input)) return input;

            var array = [];
            for (var objectKey in input) {
                array.push(input[objectKey]);
            }

            array.sort(function (a, b) {
                a = parseInt(a[attribute]);
                b = parseInt(b[attribute]);
                return a - b;
            });
            return array;
        };
    });
})();
