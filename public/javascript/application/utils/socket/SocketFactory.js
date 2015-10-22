(function () {
    'use strict';

    angular
        .module('wakemeup')
        .factory('Socket', Socket)

    Socket.$inject = ['$rootScope'];

    function Socket($rootScope) {
        var socket = io.connect();
        return {
            removeAllListeners: function (name) {
                socket.removeAllListeners(name);
            },
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }
})();