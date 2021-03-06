(function() {
    "use strict";

    var app = angular.module('dailydish');


    app.controller('DashboardCtrl', ['$scope', '$auth', '$service', '$timeout', '$uibModal', '$state', function ($scope, $auth, $service, $timeout, $uibModal, $state) {
        $scope.userArticles = [];
        $scope.comment = '';
        $scope.loading = true;


        var getUser = function () {
            $service.getUser()
                .then(function (res) {
                    if (res.data === "") {
                        $auth.logout();
                        $state.go('login');
                    } else {
                        var user = $scope.user = res.data || {};

                        if (!$scope.user.picture) {
                            $scope.user.picture = '../img/default.png';
                        }

                        var UserQuestions = user.questions || [];

                        _.each(UserQuestions, function (question) {
                            if (question.sport === 'NBA') {
                                question.img = "../img/icons/nba.ico";
                            }
                            if (question.sport === 'MLB') {
                                question.img = "../img/icons/mlb.ico";
                            }
                            if (question.sport === 'NFL') {
                                question.img = "../img/icons/nfl.ico";
                            }
                        });

                        $scope.loading = false;
                    }
                })
                .catch(function (err) {
                    $state.go('login');
                });
        };
        getUser();

        $scope.open = function () {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'mobal-body',
                templateUrl: 'modalEdit.html',
                controller: 'DashboardModalInstanceCtrl',
                size: 'lg',
                scope: $scope
            });
        };
    }]);

    app.controller('DashboardModalInstanceCtrl', ['$scope', '$uibModalInstance', 'filePickerService', 'toastr', '$timeout', '$auth', '$state', function ($scope, $uibModalInstance, filepickerService, toastr, $timeout, $auth, $state) {
        $scope.passwordActive = false;
        $scope.socialActive = false;
        $scope.buttonClicked = false;
        $scope.pictureActive = false;
        $scope.edit = {};
        $scope.final = {};

        $scope.editPassword = function() {
            $scope.buttonClicked = true;
            $scope.passwordActive = true;
            $timeout(function() {
                $scope.$apply();
            });
        };

        $scope.submitPassword = function() {
            toastr.warning('Feature is not available at this time');
        };

        $scope.editPicture = function() {
            $scope.buttonClicked = true;
            $scope.pictureActive = true;
            $timeout(function() {
                $scope.$apply();
            });
        };

        $scope.submitPic = function() {
            toastr.warning('Feature is not available at this time');
        };

        $scope.manageSocial = function() {
            $scope.buttonClicked = true;
            $scope.socialActive = true;
            $timeout(function() {
                $scope.$apply();
            });
        };

        $scope.link = function (provider) {
            if(provider == 'twitter') {
                toastr.warning('Links with Twitter accounts are not available at this time');
                return;
            }
            $auth.authenticate(provider)
                .then(function () {
                    toastr.success('You have successfully signed in with ' + provider + '!');
                    $state.reload();
                })
                .catch(function (error) {
                    if (error.error) {
                        // Popup error - invalid redirect_uri, pressed cancel button, etc.
                        toastr.error(error.error);
                    } else if (error.data) {
                        // HTTP response error from server
                        toastr.error(error.data.message, error.status);
                    } else {
                        toastr.error(error);
                    }
                });
        };

        $scope.unlink = function (provider) {
            $auth.unlink(provider)
                .then(function () {
                    toastr.info('You have unlinked a ' + provider + ' account');
                    getUser();
                })
                .catch(function (response) {
                    toastr.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.upload = function () {
            filepickerService.pick({
                    mimetype: 'image/*',
                    language: 'en',
                    services: ['COMPUTER', 'FACEBOOK'],
                    openTo: 'COMPUTER',
                    container: 'window',
                    maxSize: '1048576'
                },
                function (Blob) {
                    $scope.edit.picture = Blob;
                }
            );
        };
    }]);

})();
