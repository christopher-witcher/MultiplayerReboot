    //var webAddress = "http://siblingrivalry.azurewebsites.net";
var webAddress = "http://127.0.0.1:1337";

//var io = require('socket.io');
var socket = io.connect(webAddress);


    
    window.onload = function () {
        var status = document.getElementById("status");
        var name = document.getElementById("nameBox");
        var joinBtn = document.getElementById("join");
        //Submit users name for game play
        joinBtn.addEventListener('click', function (e) {
            socket.name = name;
            socket.emit('join', {name: name.value });
        }, false);

        socket.on('start', function (data) {
            
            status.innerHTML = "Welcome to Sibling Rivalry<br />"
                         + "Please enter your name and click join";

        });

        socket.on('waiting', function (data) {
            status.innerHTML = data.message;
        });

    };
