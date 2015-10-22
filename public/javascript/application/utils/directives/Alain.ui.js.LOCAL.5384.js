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

