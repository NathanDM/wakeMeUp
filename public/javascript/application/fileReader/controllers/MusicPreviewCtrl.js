(function (){

    angular
        .module('wakemeup')
        .controller('MusicPreviewCtrl', MusicPreviewCtrl);

        MusicPreviewCtrl.$inject = ['$rootScope', '$scope',  '$state', 'EventNames', 'Player', 'Socket'];

        function MusicPreviewCtrl($rootScope, $scope,  $state, EventNames, Player, Socket) {

            //region Init
            init(this);

            function init(self) {

                $scope.audioPlaylist = Player.getPlaylist();
                $scope.seekPercentage = seekPercentage;
                $scope.isPlaylistVisible = false;

                $scope.audioPlaylist.isVisible = true;


    //        $scope.add = add;
                $scope.play = play;
                $scope.pause = pause;
    //        $scope.togglePlaylistPanel = togglePlaylistPanel;
    //        $scope.togglePlaylist = togglePlaylist;
    //        $scope.storePlaylist = storePlaylist;
    //        $scope.removeSong = removeSong;
    //        $rootScope.$on(EventNames.master.panels.add, add);
                $rootScope.$on(EventNames.master.panels.play, play);
                $rootScope.$on(EventNames.master.panels.pause, pause);

                $scope.$watch("mediaPlayer.currentTrack", function (value) {
                    Player.setAudioPlayer($scope.mediaPlayer);

                    if ($scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1]) {
                        $scope.title = $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].title;
                        $scope.parentDirLabel = $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].parentLabel;
                    }
                })

                /**
                 * Keyboard event
                 */
                window.onkeyup = function (evt) {
                    evt = evt || window.event;
                    evt.preventDefault();
                    evt.stopPropagation();
                    if (event.keyCode == 32) {
                        if ($scope.audioPlaylist.length > 0) {
                            if ($scope.mediaPlayer.playing) {
                                $scope.mediaPlayer.pause($scope.mediaPlayer.currentTrack - 1);
    //                       play(null, null, $scope.audioPlaylistEnriched);
                            } else {
                                $scope.mediaPlayer.play($scope.mediaPlayer.currentTrack - 1);
                            }
                        }
                    }
                };
            }

    //    function removeSong(e, index, playlist) {
    //        e.preventDefault();
    //        e.stopPropagation();
    //
    //        var userPlaylist = $scope.userPlaylists[playlist.index].playlist;
    //        userPlaylist.splice(index, 1);
    //        userPlaylist = userPlaylist.filter(function(n){ return n != undefined });
    //        $scope.userPlaylists[playlist.index].playlist = userPlaylist;
    //    }
    //
    //    function storePlaylist (e, playlist) {
    //        e.preventDefault();
    //        e.stopPropagation();
    //        if (!playlist.index) {
    //            playlist.index = $scope.userPlaylists.length;
    //        }
    //        $scope.userPlaylists[playlist.index] = playlist;
    //        localStorage.setItem('userPlaylists',angular.toJson($scope.userPlaylists));
    //    }
    //
    //    function togglePlaylistPanel () {
    //        $scope.isPlaylistVisible = !$scope.isPlaylistVisible;
    //        $rootScope.$broadcast(EventNames.master.panels.togglePlaylist, $scope.isPlaylistVisible);
    //
    //    }
    //
    //    function togglePlaylist (playlist) {
    //        playlist.isVisible = !playlist.isVisible;
    //    }
    //
    //    function seekPercentage(e){
    //        e.x
    //        console.log(e);
    //    }
    //
    //    function add (e, song) {
    //        $scope.audioPlaylist.push(angular.copy(song));
    //    }

            function play(e, index, playlistEnriched) {
                if ($scope.audioPlaylist != playlistEnriched.playlist) {
                    updatePlaylist(e, playlistEnriched, index);
                } else {
                    if ($rootScope.isListener) {
                        if ($scope.mediaPlayer.loadPercent) {
                            $scope.mediaPlayer.playPause(index);

                        } else {
                            $scope.mediaPlayer.load();
                            $scope.mediaPlayer.on("canplay", function () {
                                $scope.mediaPlayer.off("canplay");
                                play(null, index, playlistEnriched);

                            })
                        }
                        if ($scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1]) {
                            $scope.title = $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].title;
                            $scope.parentDirLabel = $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].parentLabel;
                        }
                    }
                    if ($rootScope.isBroadcaster) {
                        Socket.emit('music:playSong', index);
                    }
                }
            }

            function pause(e) {
                $scope.mediaPlayer.pause();
            }

            function updatePlaylist(e, playlist, index) {
                $scope.audioPlaylist = playlist.playlist;
                $scope.audioPlaylistEnriched = {};
                $scope.audioPlaylistEnriched.isVisible = true;
                $scope.audioPlaylistEnriched.playlist = $scope.audioPlaylist;
                $scope.audioPlaylistEnriched.name = playlist.name;
                Player.updatePlaylist($scope.audioPlaylistEnriched);
                Player.setAudioPlayer($scope.mediaPlayer);

                play(e, index, $scope.audioPlaylistEnriched);

            }
        }
})();
