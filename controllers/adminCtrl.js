var mm = require('musicmetadata');
fs = require('fs');


var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://127.0.0.1:3001/meteor';
var db;
MongoClient.connect(url, function (err, database) {
    db = database;
})

var endsWith = function (element, suffix) {
    return element.indexOf(suffix, element.length - suffix.length) !== -1;
};


var parent;
// Keep track of which names are used so that there are no duplicates
var adminCtrl = {

    walk: function (dir, done) {
        var directory = {};
        var name = dir.split("/");

        directory.name = name[name.length - 1];
        name.pop();
        if (name.length <= 1) {
            directory.parent = name[0];
        } else {
            directory.parent = name.join('/');
        }

        directory.src = dir;
        directory.files = [];
        directory.dir = true;

        fs.readdir(dir, function (err, list) {
            if (err) return done(err);
            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file) return done(null, directory);
                var fileName = file;
                file = dir + '/' + file;

                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        adminCtrl.walk(file, function (err, res) {
                            directory.files.push(res);
                            var collection = db.collection('documents');
                            // Insert some documents
                            collection.insert([res]);
                            next();
                        });
//                        next();
                    } else {
                        if (endsWith(fileName, "jpg") || endsWith(fileName, "png")) {
                            directory.imgUrl = './' + file.split("./public/").join('');
                        } else if (endsWith(fileName, "mp3") || endsWith(fileName, "m4a")) {
                            directory.containSong = true;

                            var retval = {};
                            retval.dir = false;
                            retval.name = fileName;
                            retval.src = './' + file.split("./public/").join('');
                            retval.type = 'audio/mp3';
                            retval.title = fileName.split(".mp3").join('').split('_').join(' ');

                            var name = file.split("/");
                            name.pop();
                            retval.parentUrl = name.join('/');
                            name = name.join('/').split("/");
                            retval.parentLabel = name.pop();
                            var collection = db.collection('documents');
                            // Insert some documents
                            collection.insert([retval]);
                            directory.files.push(retval);
                        }
                        next();
                    }
                });

            })();
            var collection = db.collection('documents');
            collection.insert([directory]);

        })

    },
    remove: function (dir, callback) {
        var collection = db.collection('documents');
        collection.remove({}, function (err, res) {
            if (err) return done(err);

            callback(undefined, res);
        });
    },


    getAll :function (dir, callback) {
        var collection = db.collection('documents');
        // Find some documents
        collection.find({}).toArray(function (err, docs) {
            callback(err, {mess: docs});
        });
    }
};


module.exports = adminCtrl;
