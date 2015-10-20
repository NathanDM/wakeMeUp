/**
 * Services holding the names of all scope events used
 * This avoids name conflicts and enables easier scope event refactorings
 *
 * @class EventNames
 * @module util
 */
WMU.factory('EventNames', function () {

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
                play : "master > panels > play",
                pause : "master > panels > pause",
                add : "master > panels > add",
                togglePlaylist : "master > panels > togglePlaylist"
            },
            player: {
                update : "master > player > update"
            }
        }
    }
});