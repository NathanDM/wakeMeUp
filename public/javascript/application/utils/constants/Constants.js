(function () {
    'use strict';


    angular
        .module('wakemeup')
        .service('Constants', Constants);

    function Constants() {
        var MODE = {
            remote: "remote",
            apps: "apps"
        };

        return {
            MODE: MODE
        };
    }
})();