(function () {
    "use strict";

    var app = angular.module('dailydish.services', [])


        app.service('$service', function ($q, $http) {
            this.submitArticle = function (article) {
                return $http.post('/articles', article);
            };
            this.getUser = function () {
                return $http.get('/api/me');
            };
            this.getArticle = function (id) {
                return $http.get('/articles/' + id);
            };
            this.articlesList = function () {
                return $http.get('/articles');
            };
            this.submitQuestion = function (question) {
                return $http.post('/questions', question);
            };
            this.questionsList = function () {
                return $http.get('/questions');
            };
            this.getQuestion = function (id) {
                return $http.get('/questions/' + id);
            };
            this.addAnswer = function (question, answer) {
                return $http.post('/questions/' + question._id + '/answers', answer);
            };
            this.addLikeAns = function (question, answer) {
                return $http.put('/questions/' + question._id + '/answers/' + answer._id + '/addLike', answer);
            };
            this.addDislikeAns = function (question, answer) {
                return $http.put('/questions/' + question._id + '/answers/' + answer._id + '/addDislike', answer);
            };
            this.addComment = function (article, comment) {
                return $http.post('/articles/' + article._id + '/comments', comment);
            };
            this.addLikeCom = function (article, comment) {
                return $http.put('/articles/' + article._id + '/comments/' + comment._id + '/addLike', comment);
            };
            this.addDislikeCom = function (question, comment) {
                return $http.put('/articles/' + article._id + '/comments/' + comment._id + '/addDislike', comment);
            };
            this.submitArticleRating = function (article, rating) {
                return $http.put('/articles/' + article._id + '/rate', rating);
            };
            this.rateAnswer = function (question, answer) {
                return $http.put('/questions/' + question._id + '/answers/' + answer._id + '/rate', answer);
            };
            this.addFlagAns = function (question, answer) {
                return $http.put('/questions/' + question._id + '/answers/' + answer._id + '/flag', answer);
            };
        });
})();
