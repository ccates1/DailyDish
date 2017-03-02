angular.module('dailydish.services', [])
  .service('$service', function($q, $http) {
    this.submitArticle = function(article) {
      return $http.post('/articles', article);
    };
    this.getUser = function() {
      return $http.get('/api/me');
    };
    this.getArticle = function(id) {
      return $http.get('/articles/' + id);
    };
    this.articlesList = function() {
      return $http.get('/articles');
    };
    this.submitQuestion = function(question) {
      return $http.post('/questions', question);
    };
    this.questionsList = function() {
      return $http.get('/questions');
    };
    this.getQuestion = function(id) {
      return $http.get('/questions/' + id);
    };
    this.addAnswer = function(question, answer) {
      return $http.post('/questions/' + question._id + '/answers', answer);
    };
    this.addLike = function(question, answer) {
      return $http.put('/questions/' + question._id + '/answers/' + answer._id + '/addLike', answer);
    };
    this.addDislike = function(question, answer) {
      return $http.put('/questions/' + question._id + '/answers/' + answer._id + '/addDislike', answer);
    };
  });
