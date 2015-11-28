/**
 * Created by Theo on 28/11/2015.
 */
(function () {


    angular
        .module('wakemeup')
        .controller('SideNavController', SideNavController);

    SideNavController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'EventNames', 'Player', 'Socket'];

    function SideNavController($scope, $rootScope, $state, $stateParams, EventNames, Player, Socket) {

        //region Init
        init(this);

        function init(self) {


        }
    }
})();