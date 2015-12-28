(function () {
    'use strict';

    angular
        .module('wakemeup')
        .directive('myPlayer', myPlayer);

    function myPlayer() {
        var directive = {
            templateUrl: 'javascript/application/player/views/player.html',
            restrict: 'EA',
            controller: PlayerViewCtrl
        };
        return directive;

    }

    PlayerViewCtrl.$inject = ['$scope', '$rootScope', '$state', 'EventNames', 'Player', 'Socket', '$window'];

    function PlayerViewCtrl($scope, $rootScope, $state, EventNames, Player, Socket, $window) {

        //region Init
        init(this);

        function init(self) {

            $scope.audioPlaylist = Player.getPlaylist();
            $scope.seekPercentage = seekPercentage;
            $scope.isPlaylistVisible = false;

            $scope.audioPlaylist.isVisible = true;
            $scope.castAvailable = window.castAvailable;
            $scope.$watch(
                function () {
                    return $window.castAvailable
                }, function(n,o){
                    $scope.castAvailable = window.castAvailable;
                }
            );
            var localData = JSON.parse(localStorage.getItem('userPlaylists'));
            $scope.userPlaylists = [];

            if (localData) {
                $scope.userPlaylists = localData;
            }

            $scope.add = add;
            $scope.play = play;
            $scope.pause = pause;
            $scope.launchApp = launchApp;

            $scope.togglePlaylistPanel = togglePlaylistPanel;
            $scope.togglePlaylist = togglePlaylist;
            $scope.storePlaylist = storePlaylist;
            $scope.removeSong = removeSong;
            $rootScope.$on(EventNames.master.panels.add, add);
            $rootScope.$on(EventNames.master.panels.play, play);
            $rootScope.$on(EventNames.master.panels.pause, pause);

            $scope.$watch("mediaPlayer.currentTrack", function (value) {
                Player.setAudioPlayer($scope.mediaPlayer);

                if ($scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1]) {
                    $scope.title = $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].title;
                    $scope.imgUrl = $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].imgUrl;
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
                        } else {
                            $scope.mediaPlayer.play($scope.mediaPlayer.currentTrack - 1);
                        }
                    }
                }
            };
        }

        //TODO:MOVE on a service
        //CHROMCAST END
        function launchApp() {
            console.log("Launching the Chromecast App...");
            chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
        }


        function onRequestSessionSuccess(e) {
            console.log("Successfully created session: " + e.sessionId);
            session = e;
            loadMedia();

        }

        function loadMedia() {
            if (!session) {
                console.log("No session.");
                return;
            }
            if ($scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1]) {

                var mediaInfo = new
                    chrome.cast.media.MediaInfo('http://78.193.148.177:3010/' + $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].src);
                mediaInfo.contentType = 'audio/mpeg';

                var request = new chrome.cast.media.LoadRequest(mediaInfo);
                mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
                mediaInfo.metadata.title = "Title : " + $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].title;
                mediaInfo.metadata.images = [
                    new chrome.cast.Image('http://78.193.148.177:3010/' + $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].imgUrl), // ex: http://www.thestation.com/icon.png
                    new chrome.cast.Image('http://78.193.148.177:3010/' + $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].imgUrl) // fallback
                ];

                session.loadMedia(request, onLoadSuccess, onLoadError);
            }
        }

        function onLoadSuccess(media) {
            console.log('Successfully loaded media.');
            console.log('media', media);
            media.play(null,
                function (e) {
                    console.log("%c succes : ", "color:green", e)
                }, function (e) {
                    console.log("%cerror : ", "color:red", e)
                });
        }

        function onLoadError(e) {
            console.log("%cerror : ", "color:red", e)

        }

        function onLaunchError() {
            console.log("Error connecting to the Chromecast.");
        }

        //CHROMCAST END
        function removeSong(e, index, playlist) {
            e.preventDefault();
            e.stopPropagation();

            var userPlaylist = $scope.userPlaylists[playlist.index].playlist;
            userPlaylist.splice(index, 1);
            userPlaylist = userPlaylist.filter(function (n) {
                return n != undefined
            });
            $scope.userPlaylists[playlist.index].playlist = userPlaylist;
        }

        function storePlaylist(e, playlist) {
            e.preventDefault();
            e.stopPropagation();

            if (!playlist.index) {
                playlist.index = $scope.userPlaylists.length;
            }
            $scope.userPlaylists[playlist.index] = playlist;
            localStorage.setItem('userPlaylists', angular.toJson($scope.userPlaylists));
        }

        function togglePlaylistPanel() {
            $scope.isPlaylistVisible = !$scope.isPlaylistVisible;
            $rootScope.$broadcast(EventNames.master.panels.togglePlaylist, $scope.isPlaylistVisible);

        }

        function togglePlaylist(playlist) {
            playlist.isVisible = !playlist.isVisible;
        }

        function seekPercentage(e) {
            console.log(e);
        }

        function add(e, song) {
            $scope.audioPlaylist.push(angular.copy(song));
        }

        function play(e, index, playlistEnriched) {
            if ($scope.audioPlaylist != playlistEnriched.playlist) {
                updatePlaylist(e, playlistEnriched, index);
            } else {
                if ($rootScope.isListener) {
                    if ($scope.mediaPlayer.loadPercent) {
                        $scope.mediaPlayer.playPause(index);

                    } else {
                        $scope.mediaPlayer.load($scope.audioPlaylist[index], true);
                        $scope.mediaPlayer.on("canplay", function () {
                            $scope.mediaPlayer.off("canplay");
                            //play(null, index, playlistEnriched);

                        })
                    }
                    if ($scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1]) {
                        $scope.title = $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].title;
                        $scope.imgUrl = $scope.audioPlaylist[$scope.mediaPlayer.currentTrack - 1].imgUrl;
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
