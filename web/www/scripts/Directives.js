(function () {
    "use strict";

    var app = angular.module('dailydish.directives', []);

    app.directive('navDirective', [function () {
        return {
            scope: false,
            link: function (scope, element, attrs) {

                element.on('hide.bs.collapse', function () {
                    // debugger;
                    var btn = angular.element(document.querySelector('#nav-btn'));

                    btn.text('MENU');
                });

                element.on('show.bs.collapse', function () {
                    var btn = angular.element(document.querySelector('#nav-btn'));

                    btn.html('<i class="form-fa fa fa-times"></i>');
                });

            }
        };
    }]);

    app.directive('btnCheckboxGroup', [function () {
        return {
            scope: false,
            restrict: 'A',
            link: function (scope, element, attrs) {
                var firstBtn = element.find('#dfs1');
                var secondBtn = element.find('#dfs2');
                var firstIcon = element.find('#fa1');
                var secondIcon = element.find('#fa2');

                firstBtn.bind('click', function () {
                    firstBtn.removeClass('btn-outline-primary').addClass('btn-primary');
                    secondBtn.removeClass('btn-primary').addClass('btn-outline-primary');
                    firstIcon.removeClass('hide');
                    secondIcon.addClass('hide');
                });

                secondBtn.bind('click', function () {
                    secondBtn.removeClass('btn-outline-primary').addClass('btn-primary');
                    firstBtn.removeClass('btn-primary').addClass('btn-outline-primary');
                    secondIcon.removeClass('hide');
                    firstIcon.addClass('hide');
                })
            }
        };
    }]);
})();