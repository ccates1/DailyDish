angular.module('dailydish.services', [])
.service('$service', function($q, $http) {
  this.submitArticle = function(article) {
    return $http.post('/articles/' + article);
  };
});
