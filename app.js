var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Front
var routes = require('./server/routes/index');
//WebService
var music = require('./server/routes/ws/music');
var adminWS = require('./server/routes/ws/adminWS');
var fileWS = require('./server/routes/ws/fileWS');
//Controller
var userCtrl = require('./server/controllers/userController');

//view engine
var app = express();

//server
var server = app.listen(3010, function() {
    console.log('Express server listening on port ' + server.address().port);
});

//Web SocketIO
var io = require('socket.io')(server);


// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Path
app.use('/', routes);

//WebServices
app.use('/ws', music);
app.use('/admin', adminWS);
app.use('/file', fileWS);

//WebSocket
io.on('connection', function (socket) {
    userCtrl(socket);
});


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('blank-page.html', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
