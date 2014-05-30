    //var webAddress = "http://siblingrivalry.azurewebsites.net";
var webAddress = "http://127.0.0.1:1337";

//var io = require('socket.io');
var socket = io.connect(webAddress);
var gameboard = new GameBoard();
var heroSpriteSheet = "/images/runboySprite.png";
var player;
    
    window.onload = function () {
        var status = document.getElementById("status");
        var name = document.getElementById("nameBox");
        var joinBtn = document.getElementById("join");
        //Submit users name for game play
        joinBtn.addEventListener('click', function (e) {
            socket.name = name;
            socket.emit('join', { name: name.value });

        }, false);

        socket.on('sync', function (data) {
            gameboard.players = data.players;

            console.log(gameboard.players[0].name === name.value ? gameboard.players[0] : gameboard.players[1]);
        });

        socket.on('initGame', function (data) {
            player = gameboard.getPlayer(name.value);
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

    GameBoard.prototype.getPlayer = function (name) {
        if (this.players[0].name === name) {
            return this.players[0];
        } else {
            return this.players[1];
        }
    }