var adminCtrl = require('./../../controllers/adminCtrl.js');
var express = require('express');
var router = express.Router();

router.get('/init', function (req, res) {
    adminCtrl.init().then(function (results) {
        res.send(JSON.stringify(results));
    });
});
router.get('/remove', function (req, res) {
    var dir = "./public/musique";
    adminCtrl.remove(dir, function (err, results) {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});
router.get('/all', function (req, res) {
    adminCtrl.readAll(function (result) {
        res.send(JSON.stringify(result));
    });
});

router.get('/read', function (req, res) {
    var dir = req.query.file;
    dir = dir === "" || dir === "?" || dir === undefined ? "./public/musique/" : dir;
    console.log(dir);
    adminCtrl.readDir(dir, function (result) {
        res.send(JSON.stringify(result));
    });
});

module.exports = router;
