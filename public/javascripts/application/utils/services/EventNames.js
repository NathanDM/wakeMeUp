/**
 * Services holding the names of all scope events used
 * This avoids name conflicts and enables easier scope event refactorings
 *
 * @class EventNames
 * @module util
 */
(function () {
    'use strict';

    angular
        .module('wakemeup')
        .factory('EventNames', EventNames);

    function EventNames() {

        return {
            /**
             * Holds events names children of the master state
             * They are accessed following the states hierarchy
             *
             * @property master
             * @public
             * @static
             * @type {Object}
             */
            master: {
                panels: {
                    updatePlaylist: "master > panels > updatePlaylist",
                    play: "master > panels > play",
                    pause: "master > panels > pause",
                    add: "master > panels > add",
                    togglePlaylist: "master > panels > togglePlaylist"
                },
                player: {
                    update: "master > player > update"
                }
            }
        }
    }
})();