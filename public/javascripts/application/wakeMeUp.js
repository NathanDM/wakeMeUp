// Make sure to include the `ui.router` module as a dependency
var WMU = angular.module('wakemeup', ['ui.router', 'ui.unique', 'mediaPlayer', 'ui.router.state', 'ngSanitize']);

WMU.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('master', {
            "abstract": true,
            views: {
                "masterView": {
                    templateUrl: function () {
                        return "javascripts/application/master/views/masterView.html";
                    },
                    "controller": "MasterCtrl"
                }

            }
        }).state('master.music', {
            "url" : "/",
            views: {
                "navView": {
                    templateUrl: function () {
                        return "javascripts/application/nav/views/navView.html";
                    },
                    controller: "NavViewCtrl"
                },
                "playerView" : {
                    templateUrl: function() {
                        return "javascripts/application/player/views/player.html";
                    },
                    "controller": "PlayerViewCtrl"
                },
                "directoryView": {
                    templateUrl: function () {
                        return "javascripts/application/fileReader/views/directoryView.html";
                    },
                    controller: "DirectoryViewCtrl"
                },
                "musicPreview": {
                    templateUrl: function () {
                        return "javascripts/application/fileReader/views/musicPlayerPreview.html";
                    },
                    controller: "musicPreviewCtrl"
                }
            }
        })
});