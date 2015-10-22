<<<<<<< HEAD:public/javascripts/application/utils/directives/Alain.ui.js
(function () {
    'use strict';

    angular
        .module('wakemeup')
        .directive('alain', alain);

    function alain() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                svgWidth: '@',
                svgHeight: '@'
            },
            link: function (scope, element, attrs, controllers) {

            },
            templateUrl: 'javascripts/application/utils/directives/views/Alain.html'
        };
    }
})();
=======
WMU.directive('alain', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            svgWidth: '@',
            svgHeight: '@'
        },
        link: function(scope, element, attrs, controllers) {

        },
        templateUrl: 'javascript/application/utils/directives/views/Alain.html'
    };
});
>>>>>>> origin/master:public/javascript/application/utils/directives/Alain.ui.js

