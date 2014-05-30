    //var webAddress = "http://siblingrivalry.azurewebsites.net";
var webAddress = "http://127.0.0.1:1337";

//var io = require('socket.io');
var socket = io.connect(webAddress);
var gameboard = new GameBoard();
var ASSET_MANAGER = new AssetManager();
var heroSpriteSheet = "/images/runboySprite.png";
ASSET_MANAGER.queueDownload(heroSpriteSheet);
var myName;
var player;
var gameEngine = new GameEngine();

window.onload = function () {
    var status = document.getElementById("status");
    var name = document.getElementById("nameBox");
    myName = name.value;
    var joinBtn = document.getElementById("join");
    //Submit users name for game play
    joinBtn.addEventListener('click', function (e) {
        socket.name = name.value;
        socket.emit('join', { name: name.value });
        player = new RunBoy(canvasWidth, worldWidth, name.value);
        
        ASSET_MANAGER.downloadAll(function () {});
        player.initializeAnimation();
    }, false);

    socket.on('sync', function (data) {
        gameboard.players = data.players;

        console.log(gameboard.players[0].name === name.value ? gameboard.players[0] : gameboard.players[1]);
    });

    socket.on('initGame', function (data) {
        player.update(gameboard.getPlayer(myName));
        var canvas = document.getElementById("world");
        canvas.focus();
        var ctx = canvas.getContext("2d");
        gameEngine.init(ctx, name.value);
        console.log(player);
    });

    socket.on('start', function (data) {

        status.innerHTML = "Welcome to Sibling Rivalry<br />"
                     + "Please enter your name and click join";

    });

    socket.on('waiting', function (data) {
        status.innerHTML = data.message;
    });

    socket.on('ready', function (data) {
        status.innerHTML = data.message;
    });

};

    //GameBoard.prototype.getPlayer = function (name) {
    //    if (this.players[0].name === name) {
    //        return this.players[0];
    //    } else {
    //        return this.players[1];
    //    }
    //}