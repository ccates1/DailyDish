var app = angular.module('dailydish');

app.controller('ArticleTemplateCtrl', function ($scope, $timeout, $service,
  toastr, $state, filepickerService, moment) {
  $scope.article = {
    sports: [],
    teams: [],
    picture: ''
  };
  $scope.tagOutput = [];
  $scope.selectedTags = [];
  $scope.teamOutput = [];
  $scope.showAdditionalTagInput = false;
  $scope.loading = true;
  $scope.tags = [
    {
      main: 'NBA',
      teams: [
        {
          icon: "<img src='./img/nbalogos/ATL.png'>",
          name: "ATL",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/BKN.png'>",
          name: "BKN",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/BOS.png'>",
          name: "BOS",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/CHA.png'>",
          name: "CHA",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/CHI.png'>",
          name: "CHI",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/CLE.jpg'>",
          name: "CLE",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/DAL.png'>",
          name: "DAL",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/DEN.png'>",
          name: "DEN",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/DET.png'>",
          name: "DET",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/GSW.png'>",
          name: "GSW",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/HOU.png'>",
          name: "HOU",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/IND.png'>",
          name: "IND",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/LAC.jpg'>",
          name: "LAC",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/LAL.jpg'>",
          name: "LAL",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/MEM.png'>",
          name: "MEM",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/MIA.png'>",
          name: "MIA",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/MIL.png'>",
          name: "MIL",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/MINN.png'>",
          name: "MIN",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/NO.png'>",
          name: "NO",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/NYK.jpg'>",
          name: "NYK",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/OKC.png'>",
          name: "OKC",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/ORL.png'>",
          name: "ORL",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/PHI.jpg'>",
          name: "PHI",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/PHX.jpg'>",
          name: "PHX",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/POR.png'>",
          name: "POR",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/SA.png'>",
          name: "SA",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/SAC.jpg'>",
          name: "SAC",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/TOR.png'>",
          name: "TOR",
          ticked: false
        },
        {
          icon: "<img src='./img/nbalogos/WAS.png'>",
          name: "WAS",
          ticked: false
        }
      ]
    },
    {
      main: 'MLB',
      teams: [
        {
          icon: "<img src='./img/mlblogos/ARI.jpeg'>",
          name: "ARI",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/ATL.jpg'>",
          name: "ATL",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/BAL.jpg'>",
          name: "BAL",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/BOS.jpg'>",
          name: "BOS",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/CHC.jpg'>",
          name: "CHC",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/CIN.jpeg'>",
          name: "CIN",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/CLE.jpg'>",
          name: "CLE",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/COL.jpg'>",
          name: "COL",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/CWS.jpg'>",
          name: "CWS",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/DET.jpg'>",
          name: "DET",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/HOU.jpg'>",
          name: "HOU",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/KC.png'>",
          name: "KC",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/LAA.jpg'>",
          name: "LAA",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/LAD.jpg'>",
          name: "LAD",
          ticked: false
        },
        {
          icon: "<KC src='./img/mlblogos/MIA.png'>",
          name: "MIA",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/MIL.png'>",
          name: "MIL",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/MINN.png'>",
          name: "MINN",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/NYM.jpg'>",
          name: "NYM",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/NYY.jpg'>",
          name: "NYY",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/OAK.jpg'>",
          name: "OAK",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/PHI.jpg'>",
          name: "PHI",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/PITT.png'>",
          name: "PITT",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/SD.png'>",
          name: "SD",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/SEA.jpg'>",
          name: "SEA",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/SF.png'>",
          name: "SF",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/STL.jpg'>",
          name: "STL",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/TB.jpg'>",
          name: "TB",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/TEX.jpg'>",
          name: "TEX",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/TOR.jpg'>",
          name: "TOR",
          ticked: false
        },
        {
          icon: "<img src='./img/mlblogos/WAS.jpg'>",
          name: "WAS",
          ticked: false
        }
      ]
    },
    {
      main: 'NFL',
      teams: [
        {
          icon: "<img src='./img/nfllogos/ARZ.png'>",
          name: "ATL",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/ATL.png'>",
          name: "ATL",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/BAL.png'>",
          name: "BAL",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/BUF.png'>",
          name: "BUF",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/CAR.png'>",
          name: "CAR",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/CHI.jpg'>",
          name: "CHI",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/CINN.png'>",
          name: "CIN",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/CLE.png'>",
          name: "CLE",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/DAL.png'>",
          name: "DAL",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/DEN.jpeg'>",
          name: "DEN",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/DET.png'>",
          name: "DET",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/GB.jpg'>",
          name: "GB",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/HOU.jpg'>",
          name: "HOU",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/IND.png'>",
          name: "IND",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/JAX.png'>",
          name: "JAX",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/KC.png'>",
          name: "KC",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/LA.png'>",
          name: "LA",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/MIA.png'>",
          name: "MIA",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/MINN.png'>",
          name: "MIN",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/NE.png'>",
          name: "NE",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/NO.png'>",
          name: "NO",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/NYG.png'>",
          name: "NYG",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/NYJ.png'>",
          name: "NYJ",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/OAK.png'>",
          name: "OAK",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/PHI.jpg'>",
          name: "PHI",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/PITT.png'>",
          name: "PITT",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/SD.png'>",
          name: "SD",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/SEA.png'>",
          name: "SEA",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/SF.png'>",
          name: "SF",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/TB.jpg'>",
          name: "TB",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/TEN.png'>",
          name: "TEN",
          ticked: false
        },
        {
          icon: "<img src='./img/nfllogos/WAS.png'>",
          name: "WAS",
          ticked: false
        }
      ]
    },
    ];
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
    if ($scope.article.picture === '') {
      toastr.warning('Must upload an image for your article!', 'Warning');
      return;
    } else if ($scope.tagOutput.length === 0) {
      toastr.warning('Must select a sport for your article!', 'Warning');
      return;
    } else if ($scope.teamOutput.length === 0) {
      toastr.warning('Must select a team for your article!', 'Warning');
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
