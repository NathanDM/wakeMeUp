var fileCtrl = require('./../../controllers/fileCtrl.js');
var express = require('express');

var router = express.Router();



router.get('/get', function (req, res) {

    var dir = req.query.file;
    dir = dir === "" || dir === "?" || dir === undefined ? "./public/musique" : dir;
    fileCtrl.getFile(dir, function (err, results) {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });

});

router.get('/getWithChildren', function (req, res) {

    var dir = req.query.file;
//    dir = dir === "" || dir === "?" ? "./public/musique" : dir;
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
