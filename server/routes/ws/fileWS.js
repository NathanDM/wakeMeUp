var fileCtrl = require('./../../fileReader/controllers/fileCtrl.js');
var express = require('express');

var router = express.Router();
var parsePath  = function(dir) {
    var suffix = "/";
    dir = dir === "" || dir === "?" || dir === undefined ? "./public/musique/" : dir;

    if(dir.indexOf(suffix, dir.length - suffix.length) == -1) {
        dir = dir + suffix;
    };

    return dir;
};
router.get('/get', function (req, res) {

    var dir = req.query.file;
    dir = parsePath(dir)

    fileCtrl.getFile(dir).then(function (results) {
        res.send(JSON.stringify(results));
    });

});

router.get('/getWithChildren', function (req, res) {

    var dir = req.query.file;
    dir = parsePath(dir)

    fileCtrl.getFileWithChildren(dir).then(function (results) {
        res.send(JSON.stringify(results));
    });

});
router.get('/all', function (req, res) {
    fileCtrl.getAll(function (err, results) {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });

});


module.exports = router;
