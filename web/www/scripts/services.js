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
    }
  });
