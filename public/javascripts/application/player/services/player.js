/**
 * Player Service.
 * Manage Player.
 *
 * @module wakeMeUp
 * @class Player
 */
(function () {
    'use strict';

    angular
        .module('wakemeup')
        .factory('Player', Player);

    Player.$inject = ['$rootScope', 'EventNames'];

    function Player($rootScope, EventNames) {

        var playlist = [];
        var audioPlayer = {};

        function setAudioPlayer(player) {
            audioPlayer = player;
            $rootScope.$broadcast(EventNames.master.player.update, audioPlayer);
        }

        function getAudioPlayer() {
            return audioPlayer;
        }

        function updatePlaylist(newPlaylist, index) {
            playlist = newPlaylist;
            $rootScope.$broadcast(EventNames.master.panels.updatePlaylist, playlist, index);
        }

        function add(song) {
//        playlist.playlist.push(angular.copy(song));
            $rootScope.$broadcast(EventNames.master.panels.add, song);
        }

        function play(index, playlist) {
            $rootScope.$broadcast(EventNames.master.panels.play, index, playlist);
        }

        function pause() {
            $rootScope.$broadcast(EventNames.master.panels.pause);
        }

        function getPlaylist() {
            return playlist;
        }

        return {
            play: play,
            pause: pause,
            updatePlaylist: updatePlaylist,
            getPlaylist: getPlaylist,
            add: add,
            setAudioPlayer: setAudioPlayer,
            getAudioPlayer: getAudioPlayer
        };
    }
})();
