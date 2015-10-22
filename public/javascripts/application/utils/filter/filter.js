(function () {
    'use strict';

    angular
        .module('wakemeup')
        .filter('reverse', reverse);

    function reverse() {
        return function (items) {
            return items.slice().reverse();
        };
    }
})();
