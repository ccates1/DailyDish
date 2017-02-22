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
  });
