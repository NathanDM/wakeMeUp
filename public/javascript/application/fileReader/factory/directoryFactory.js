/**
 * Shelf Service.
 * Manage shelves data.
 *
 * @module spaceo
 * @class Shelf
 */
(function (){
    'use strict';

angular
    .module('wakemeup')
    .factory('Directory', Directory);

    function Directory(HttpUtil) {

        /**
         * Request the shelf web service to get the shelves list corresponding to the given param.
         *
         * @method requestShelf
         * @param {Object} The params of the request
         * @returns {Promise} The promise after applying the data on the properties' object
         */
        var getContent = function (dir) {
            var urlToRequest = "ws/music/";
            var param = {dir: dir};

            return HttpUtil.request('POST', urlToRequest, param);
        }


        return {
            getContent: getContent
        };
    }
})();

///**
// * Shelf Service.
// * Manage shelves data.
// *
// * @module spaceo
// * @class Shelf
// */
//
//WMU.factory('Directory', function(HttpUtil){
//
//    /**
//     * Request the shelf web service to get the shelves list corresponding to the given param.
//     *
//     * @method requestShelf
//     * @param {Object} The params of the request
//     * @returns {Promise} The promise after applying the data on the properties' object
//     */
//    var getContent = function (dir) {
//        var urlToRequest = "file/getWithChildren" + "?file=" + dir;
//
//        return HttpUtil.request('GET', urlToRequest, {});
//    }
//
//
//
//    return {
//        getContent: getContent
//    };
//});
//
