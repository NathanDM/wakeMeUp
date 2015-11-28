var mm = require('musicmetadata');
fs = require('fs');


var parent;
// Keep track of which names are used so that there are no duplicates
var dirController = (function () {
    var endsWith = function(element, suffix) {
        return element.indexOf(suffix, element.length - suffix.length) !== -1;
    };

    var walk = function(dir, done) {
        var directory = {};
        var name = dir.split("/");

        directory.name =  name[name.length - 1];
        name.pop();
        if(name.length <= 1) {
            directory.parent = name[0];
        } else {
            directory.parent = name.join('/');
        }

        directory.src = dir;
        directory.files = [];
        directory.dir = true;
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file) return done(null, directory);
                var fileName = file;
                file = dir + '/' + file;

                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function(err, res) {
                            directory.files.push(res);
                            next();
                        });
//                        next();
                    } else {
                        if (endsWith(fileName, "jpg") || endsWith(fileName, "png")) {
                            directory.imgUrl = './' + file.split("./public/").join('');
                        } else if (endsWith(fileName, "mp3") ||endsWith(fileName, "m4a")){
                            directory.containSong = true;

                            var retval = {};
                            retval.dir = false;

//                            var stream = fs.createReadStream(file);
//                            var metadata = mm(stream, { duration: true });
//
//                            metadata.on('metadata', function (result) {
//                                var d = new Date(-3600000);
//                                d.setSeconds(result.duration);
//                                retval.duration = d.toLocaleTimeString();
//                                filesTmp--;
//                            });

                            retval.name = fileName;
                            retval.src = './' + file.split("./public/").join('');
                            retval.type = 'audio/mp3';

                            retval.title = fileName.split(".mp3").join('').split('_').join(' ');

                            var name = file.split("/");
                            name.pop();
                            retval.parentUrl = name.join('/');
                            name = name.join('/').split("/");
                            retval.parentLabel = name.pop();

                            directory.files.push(retval);
                        }
                        next();
                    }
                });

            })();
        });
    };

//
    return {
        walk: walk,
        endsWith: endsWith
    };
}());


// export function for listening to the socket
module.exports = function (dir, callBack) {
    return dirController.walk(dir,callBack);
};
