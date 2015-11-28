var dirController = require('./../ws/controllers/dirController');

var userNames = [];
// Keep track of which names are used so that there are no duplicates
var usersManager = (function () {
    var claim = function (nextUserId, user) {
        if (!user || userNames[nextUserId]) {
            return false;
        } else {
            userNames[nextUserId] = user;
            return true;
        }
    };

    // find the lowest unused "guest" name and claim it
    var getGuest = function () {
        var user = {};
        user.name = "";
        user.connected = true;
        var nextUserId = 1;

        do {
            user.id = nextUserId;
            user.name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (!claim(nextUserId, user));

        return user;
    };

    // serialize claimed names as an array
    var get = function () {
        var res = [];
        for (key in userNames) {
            if( userNames.hasOwnProperty( key ) ) {
                res.push(userNames[key]);
            }
        }

        return res;
    };

    var free = function (user) {
        if (userNames[user.id]) {
            delete userNames[user.id];
        }
    };

    return {
        claim: claim,
        free: free,
        get: get,
        getGuest: getGuest
    };
}());

// export function for listening to the socket
module.exports = function (socket) {
    var user = usersManager.getGuest();

    // send the new user their name and a list of users
    socket.emit('init', {
        id: user.id,
        name: user.name,
        connected: user.connected,
        users: usersManager.get()
    });

    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', user);

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
        socket.broadcast.emit('send:message', {
            user: user,
            text: data.message
        });
    });


    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function (data, fn) {
        if (usersManager.claim(data)) {
            var oldUser = user;
            usersManager.free(oldUser);

            socket.broadcast.emit('change:name', {
                oldUser: oldUser,
                newUser: data
            });

            fn(true);
        } else {
            fn(false);
        }
    });

    socket.on('music:changeDir', function (data) {
        dirController(data, function(err, results) {
            if (err) throw err;
            socket.broadcast.emit('music:changeDir', results)
        });
    });

    socket.on('music:playSong', function (data) {
        socket.broadcast.emit('music:playSong', data)
    });

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
        socket.broadcast.emit('user:left', user);

        var i;
        for (i = 0; i < userNames.length; i++) {
            if (userNames[i] === user) {
                userNames[i].connected = false;
                break;
            }
        }
    });
};
