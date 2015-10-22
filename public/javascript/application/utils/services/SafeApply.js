/**
 * SafeApply Service
 *
 * @module spaceo
 * @class SafeApply
 */
(function (){
    'use strict';

    angular
        .module('wakemeup')
        .factory('SafeApply', SafeApply);

    SafeApply.$inject = ['$rootScope']

    function SafeApply($rootScope){

        return function() {
            var phase = $rootScope.$$phase;
            if (phase != '$apply' && phase != '$digest') {
                $rootScope.$apply();
            }
        }
    }
})();

