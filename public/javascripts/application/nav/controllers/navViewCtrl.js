(function () {


    angular
        .module('wakemeup')
        .controller('NavViewCtrl', NavViewCtrl);

    NavViewCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'EventNames', 'Player', 'Socket'];

    function NavViewCtrl($scope, $rootScope, $state, $stateParams, EventNames, Player, Socket) {

        //region Init
        init(this);

        function init(self) {
            $scope.name = "offLine";
            $scope.messages = [];
            $scope.users = [];
            $scope.quantity = 5;

            $scope.isBroadcaster = false;
            $scope.isListener = true;
            $scope.togglePreview = togglePreview;
            $scope.$watch("isBroadcaster", function (newValue, oldValue) {
                if ($scope.isListener && newValue) {
                    $rootScope.isListener = false;
                    $scope.isListener = false;
                }
                $rootScope.isBroadcaster = newValue;
            })

            $scope.$watch("isListener", function (newValue, oldValue) {
                if ($scope.isBroadcaster && newValue) {
                    $rootScope.isBroadcaster = false;
                    $scope.isBroadcaster = false;
                }
                $rootScope.isListener = newValue;
            })

            Socket.on('init', function (data) {
                $scope.connected = data.connected;
                $scope.name = data.name;
                $scope.users = data.users;
            });

            Socket.on('user:join', function (user) {
                $scope.users.push(user);
            });

            Socket.on('user:left', function (data) {
                var i, user;
                for (i = 0; i < $scope.users.length; i++) {
                    user = $scope.users[i];
                    if (user.name === data.name) {
                        $scope.users[i].connected = false;
                        break;
                    }
                }
            });
        }

        function togglePreview() {
            ;
        }
    }
})();