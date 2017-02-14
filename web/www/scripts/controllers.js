angular.module('dailydish.controllers', ['satellizer', 'ngAnimate', 'toastr',
  'isteven-multi-select', 'ui.select'])
  .controller('NavCtrl', function($scope) {
  })
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

  })
  .controller('ArticleTemplateCtrl', function($scope, $timeout, $service) {
    $scope.article = {
      content: '',
      author: {},
      comments: [],
      sports: [],
      teams: []
    };
    $scope.tagOutput = [];
    $scope.selectedTags = [];
    $scope.teamOutput = [];
    $scope.showAdditionalTagInput = false;
    $scope.tags = [
      { main: 'NBA', teams: [{ name: 'ATL' },{ name:'BOS' }] },
      { main: 'MLB', teams: [{ name: 'ATL' },{ name:'BOS' }] },
      { main: 'NFL', teams: [{ name: 'ATL' },{ name:'BOS' }] },
    ];
    $scope.categories = [
      { icon: "<img src='./img/nba.png'>",	name: "NBA",	ticked: false },
      { icon: "<img src='./img/mlb.png'>",	name: "MLB",	ticked: false },
      { icon: "<img src='./img/nfl.png'>",	name: "NFL",	ticked: false }
    ];

    var getUser = function() {
      $service.getUser()
        .then(function(res) {
          $scope.user = res.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    };

    $scope.clicked = function(data) {
      if(data.ticked === true) {
        $scope.tags.filter(function(item) {
          if(item.main === data.name) {
            $scope.selectedTags.push(item);
          }
        });
      } else {
        for(var i = 0; i < $scope.selectedTags.length; i++) {
          if($scope.selectedTags[i].main === data.name) {
            $scope.selectedTags.splice(i, 1);
          }
        }
        $timeout(function() {
          $scope.$apply();
        });
      }
      if($scope.selectedTags.length > 0) {
        $scope.showAdditionalTagInput = true;
      } else {
        $scope.showAdditionalTagInput = false;
      }
    };

    $scope.teamClicked = function(data, selectedTag) {
      if(data.ticked === true) {
        console.log(data);
        for(var i = 0; i < selectedTag.teams.length; i++) {
          if(selectedTag.teams[i].name === data.name && data.ticked === true) {
            $scope.teamOutput.push(data.name);
          }
        }
      } else {
        for(var i = 0; i < $scope.teamOutput.length; i++) {
          if($scope.teamOutput[i] === data.name) {
            $scope.teamOutput.splice(i, 1);
          }
        }
        $timeout(function() {
          $scope.$apply();
        });
      }
    };

    $scope.submit = function() {
      $scope.tagOutput.forEach(function(item) {
        if(item.ticked === true) {
          $scope.article.sports.push(item.name);
        }
      });
      $scope.teamOutput.forEach(function(item) {
        $scope.article.teams.push(item);
      });
      $scope.article.author = $scope.user._id;
      console.log($scope.article);

      $service.submitArticle($scope.article)
        .then(function() {
          toastr.success('Your article has been posted!', 'Success')
        })
        .catch(function(err) {
          console.log(err);
          toastr.error('There was a problem and your article was not submitted.', 'Error');
        });
    };
  });
