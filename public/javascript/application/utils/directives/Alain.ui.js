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

