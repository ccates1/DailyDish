var app = angular.module('dailydish');

app.controller('ArticleTemplateCtrl', function ($scope, $timeout, $service,
  toastr, $state, filepickerService, moment) {
  $scope.article = { sports: [], teams: [] };
  $scope.tagOutput = [];
  $scope.selectedTags = [];
  $scope.teamOutput = [];
  $scope.showAdditionalTagInput = false;
  $scope.loading = true;
  $scope.tags = [{
      main: 'NBA',
      teams: [{
        name: 'ATL'
            }, {
        name: 'BOS'
            }]
        },
    {
      main: 'MLB',
      teams: [{
        name: 'ATL'
            }, {
        name: 'BOS'
            }]
        },
    {
      main: 'NFL',
      teams: [{
        name: 'ATL'
            }, {
        name: 'BOS'
            }]
        },
    ];
  $scope.categories = [{
      icon: "<img src='./img/nba.png'>",
      name: "NBA",
      ticked: false
        },
    {
      icon: "<img src='./img/mlb.png'>",
      name: "MLB",
      ticked: false
        },
    {
      icon: "<img src='./img/nfl.png'>",
      name: "NFL",
      ticked: false
        }
    ];

  var getUser = function () {
    $service.getUser()
      .then(function (res) {
        $scope.user = res.data;
        $scope.loading = false;
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  getUser();

  $scope.clicked = function (data) {
    if (data.ticked === true) {
      $scope.tags.filter(function (item) {
        if (item.main === data.name) {
          $scope.selectedTags.push(item);
        }
      });
    } else {
      for (var i = 0; i < $scope.selectedTags.length; i++) {
        if ($scope.selectedTags[i].main === data.name) {
          $scope.selectedTags.splice(i, 1);
        }
      }
      $timeout(function () {
        $scope.$apply();
      });
    }
    if ($scope.selectedTags.length > 0) {
      $scope.showAdditionalTagInput = true;
    } else {
      $scope.showAdditionalTagInput = false;
    }
  };

  $scope.teamClicked = function (data, selectedTag) {
    if (data.ticked === true) {
      console.log(data);
      for (var i = 0; i < selectedTag.teams.length; i++) {
        if (selectedTag.teams[i].name === data.name && data.ticked === true) {
          $scope.teamOutput.push(data.name);
        }
      }
    } else {
      for (var i = 0; i < $scope.teamOutput.length; i++) {
        if ($scope.teamOutput[i] === data.name) {
          $scope.teamOutput.splice(i, 1);
        }
      }
      $timeout(function () {
        $scope.$apply();
      });
    }
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
        console.log(JSON.stringify(Blob));
        $scope.article.picture = Blob;
        $scope.$apply();
      }
    );
  };

  $scope.submit = function () {
    if(!$scope.article.picture) {
      toastr.error('Must upload an image for your article!');
      return;
    } else {
      $scope.tagOutput.forEach(function (item) {
        if (item.ticked === true) {
          $scope.article.sports.push(item.name);
        }
      });
      $scope.teamOutput.forEach(function (item) {
        $scope.article.teams.push(item);
      });
      $scope.article.author = $scope.user._id;
      $scope.article.date = moment.now();

      $service.submitArticle($scope.article)
        .then(function (res) {
          toastr.success('Your article has been posted!', 'Success');
          $state.go('dashboard');

        })
        .catch(function (err) {
          console.log(err);
          toastr.error('There was a problem and your article was not submitted.', 'Error');
        });
    }
  };

});
