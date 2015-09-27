/**
 * Created by ndamie on 27/09/2015.
 */

"use strict";



var MongoClient = require('mongodb').MongoClient
    , assert = require('assert'),
    adminCtrl = require('../controllers/adminCtrl');


// Connection URL
var url = 'mongodb://127.0.0.1:3001/meteor';
var db;

var fileDao = {
    findFileBySrc : function (dir, callback) {
        var collection = db.collection('documents');
        // Find some documents
        collection.find({src: dir}).toArray(function (err, docs) {
            docs.forEach(function (doc) {
                doc.files.push(fileDao.getFile(doc.src));
            });
            callback(err, docs);
        });
    }
}

exports.module = fileDao;