var adminCtrl = require('./../../controllers/adminCtrl.js');
var express = require('express');


var router = express.Router();

var filesTmp = 0;

/* GET dir listing. */
router.get('/init', function (req, res) {
    var dir = "./public/musique";
    adminCtrl.walk(dir, function (err, results) {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

router.get('/delete', function (req, res) {
    var dir = "./public/musique";
    adminCtrl.remove(dir, function (err, results) {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});


router.get('/get', function (req, res) {

    var dir = req.query.file;
    dir = dir === "" || dir === "?" ? "./public/musique" : dir;
    adminCtrl.getFile(dir, function (err, results) {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });

});


router.get('/all', function (req, res) {

    adminCtrl.getAll("", function (err, results) {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });

});


module.exports = router;
