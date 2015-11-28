var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//SPA
var index = require('./server/routes/index');
var notFoundPage = require('./server/routes/404');
var errorPage = require('./server/routes/500');
var index = require('./server/routes/index');

//WebService
var music = require('./server/routes/ws/music');
var adminWS = require('./server/routes/ws/adminWS');
var fileWS = require('./server/routes/ws/fileWS');

//Controller
var userCtrl = require('./server/wso/userController');

//view engine
var app = express();


//server
var server = app.listen(80, function() {
    console.log('Express server listening on port ' + server.address().port);
});


// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//WebServices
//TODO:REMOVE
app.use('/ws', music);

app.use('/admin', adminWS);
app.use('/file', fileWS);

//Path
app.use('/',index);


// production error handler
// no stacktraces leaked to user
app.use(errorPage);
app.use(notFoundPage);


//Web SocketIO
var io = require('socket.io')(server);

//WebSocket
io.on('connection', function (socket) {
    userCtrl(socket);
});

module.exports = app;
