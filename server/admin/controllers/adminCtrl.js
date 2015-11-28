var mm = require('musicmetadata'),
    fs = require('fs'),
    Q = require('q'),
    _ = require('lodash'),
    Db = require('tingodb')().Db;

var wmuDb = new Db('./data', {});
var collection = wmuDb.collection('documents');

var endsWith = function (element, suffix) {
    return element.indexOf(suffix, element.length - suffix.length) !== -1;
};

// Keep track of which names are used so that there are no duplicates
var adminCtrl = {
    init: function () {
        var deferred = Q.defer(),
            file = "musique",
            parent = "./public/";

        adminCtrl.insertFileRecursively(parent, file).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    },
    insertDirRecursively: function (dirModel) {
        var deferred = Q.defer();
        var promList = [];
        dirModel.src += "/"
        fs.readdir(dirModel.src, function (err, list) {
            if (err) {
                console.log(err.mess, err);
                deferred.resolve(dirModel);
            } else {

                //Explore files
                _.each(list, function (file) {
                    var fileDeferred = Q.defer();
                    //Store the promess
                    promList.push(fileDeferred.promise);

                    //Read the file
                    adminCtrl.insertFileRecursively(dirModel.src, file).then(function (model) {
                        fileDeferred.resolve(model);
                    });
                });

                //repo is empty
                if (promList.length === 0) {
                    deferred.resolve(dirModel);
                } else {
                    Q.all(promList).then(function () {
                        deferred.resolve(dirModel);
                    });
                }
            }
        });

        return deferred.promise;
    },
    insertFileRecursively: function (dirPath, file) {
        var deferred = Q.defer();
        var retval = {
            name: file,
            type: null,
            src: dirPath + file,
            parent: dirPath
        };

        fs.stat(retval.src, function (err, stat) {
            if (err) {
                console.log(err.mess, err);
                deferred.resolve(err);
                return;
            }
            if (stat && stat.isDirectory()) {
                adminCtrl.insertDirRecursively(retval).then(function (res) {
                    res.type = "DIR";
                    collection.insert(res);
                    deferred.resolve(res);
                });
            } else {
                if (endsWith(retval.src, "jpg") || endsWith(retval.src, "png")) {
                    retval.type = "IMG";
                } else if (endsWith(retval.src, "mp3") || endsWith(retval.src, "m4a")) {
                    retval.type = "SONG";
                }
                collection.insert(retval);
                deferred.resolve(retval);
            }

        });
        return deferred.promise;
    },
    remove: function (dir, callback) {
        collection.remove({}, function (err, res) {
            if (err) return err;
            callback(undefined, res);
        });
    },
    readAll: function (callback) {
        collection.find({}).toArray(function (err, docs) {
            callback(docs);
        });
    },

    readDir: function (dirName, callback) {
        collection.find({parent: dirName}).toArray(function (err, docs) {
            callback(docs);
        });
    }
};


module.exports = adminCtrl;
