var Q = require('q'),
    _ = require('lodash'),
    Db = require('tingodb')().Db,
    wmuDb = new Db('./data', {}),
    collection = wmuDb.collection('documents');

var parent;

// Keep track of which names are used so that there are no duplicates
var fileCtrl = {

    getFile: function (dir) {
        var deferred = Q.defer();

        collection.find({src: dir}).toArray(function (err, docs) {
            if (err) deferred.resolve(err);
            deferred.resolve(docs);
        });

        return deferred.promise;
    },

    getFileWithChildren: function (dir) {
        var deferred = Q.defer();
        var retval = {};

        fileCtrl.getFile(dir).then(function (result) {
            if (result) retval = result[0];
            retval.files = [];

            fileCtrl.getChildren(dir).then(function (childrens) {
                if (childrens) retval.files = childrens;
                deferred.resolve(retval);
            })
        });

        return deferred.promise;
    },

    getChildren: function (dir) {
        var deferred = Q.defer();

        collection.find({parent: dir}).toArray(function (err, docs) {

            if (err) return deferred.resolve(err);
            deferred.resolve(docs);
        });

        return deferred.promise;
    },

    getAll: function (callback) {

        collection.find({}).toArray(function (err, docs) {
            callback(err, {mess: docs});
        });
    }
};

module.exports = fileCtrl;
