var mm = require('musicmetadata');
fs = require('fs');


var MongoClient = require('mongodb').MongoClient
    , assert = require('assert'),
    Q = require('q'),
    _ = require('lodash');

// Connection URL
var url = 'mongodb://127.0.0.1:3001/meteor';
var db;
MongoClient.connect(url, function (err, database) {
    db = database;
})


var parent;
// Keep track of which names are used so that there are no duplicates
var fileCtrl = {

    getFile: function (dir) {
        var deferred = Q.defer();

        var collection = db.collection('documents');
        // Find some documents
        collection.find({src: dir}).toArray(function (err, docs) {
            if (err) return deferred.resolve(docs);
            deferred.resolve(docs[0]);
        });

        return deferred.promise;
    },

    getFileWithChildren: function (dir) {
        var deferred = Q.defer();

        fileCtrl.getFile(dir).then(function (result) {
            result.files = [];

            fileCtrl.getChildren(dir).then(function (childrens) {
                result.files = childrens;
                deferred.resolve(result);
            })

        });

        return deferred.promise;
    },

    getChildren: function (dir) {
        var deferred = Q.defer();
        var collection = db.collection('documents');
        // Find some documents

        collection.find({parent: dir}).toArray(function (err, docs) {
            if (err) return deferred.resolve(err);
            deferred.resolve(docs);

        });

        return deferred.promise;
    },

    getAll: function (callback) {
        var collection = db.collection('documents');
        // Find some documents
        collection.find({}).toArray(function (err, docs) {
            callback(err, {mess: docs});
        });
    }
};


module.exports = fileCtrl;
