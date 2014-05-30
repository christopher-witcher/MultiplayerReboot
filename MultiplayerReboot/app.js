
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();


var GameBoard = require('./public/javascripts/gameboard.js').GameBoard;

var gameboard = new GameBoard();

// all environments
app.set('port', process.env.PORT || 1337);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

    ///////Section used to set up IO Connect//////////////

var io = require('socket.io').listen(server);
var socketsCreated = 0;
var numSockets = 0;


io.sockets.on('connection', function (socket) {

    console.log('connected');
    //socket.emit('join', gameboard);

    socket.emit('start');
    //socket.emit('join', gameboard);
    socket.on('disconnect', function () {
        numSockets--;
    });

    
        socket.on('join', function (data) {
            socketsCreated++;
            numSockets++;
            gameboard.addPlayer(data.name);
            console.log(gameboard.players);
            if (gameboard.players.length < 2) {
                 var waitStr = "Welcome " + data.name + "<br />" 
                            + "Waiting for another player to join...";
                socket.emit('waiting', { message: waitStr });
            } else {
                io.sockets.emit('sync', { players: gameboard.players });
                io.sockets.emit('initGame');
                io.sockets.emit('ready', { message: "Get ready to do battle" });
            }


        });

});
