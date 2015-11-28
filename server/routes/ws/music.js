var dirController = require('./../../ws/controllers/dirController');
var express = require('express');


var router = express.Router();

var filesTmp = 0;

/* GET dir listing. */
router.post('/music', function(req, res) {

    var dir = req.body.dir;
    filesTmp == 0;
    dirController(dir, function(err, results) {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });

});

module.exports = router;