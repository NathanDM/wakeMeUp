(function () {
    'use strict';


    angular
        .module('wakemeup')
        .controller('MasterCtrl', MasterCtrl);

    MasterCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Socket'];

    function MasterCtrl($scope, $rootScope, $state, $stateParams, Socket) {

        //region Init
        init(this);

        function init(self) {
        }
    }
})();