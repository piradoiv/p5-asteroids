var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

var last_id = 0;
var players = [];

app.use(express.static('public'));

io.on('connection', function(socket) {
    var player = {
        id: ++last_id,
        location: {
            x: (Math.random() * 100) - 50,
            y: (Math.random() * 100) - 50
        },
        heading: 0,
        velocity: {
            angle: 0,
            magnitude: 0
        },
        acceleration: {
            angle: 0,
            magnitude: 0
        }
    };

    console.log('Player #' + player.id + ' connected');
    players.push(player);

    socket.broadcast.emit('new player', player);

    socket.emit('setup', {
        id: player.id,
        players: players
    });

    socket.on('accelerate', function(msg) {
        console.log(msg);
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == player.id) {
                players[i].ship = msg;
            }
        }
        socket.broadcast.emit('moving', player);
    });

    socket.on('disconnect', function() {
        console.log('Player #' + player.id + ' disconnected');
        for (var i = players.length -1; i >= 0; i--) {
            if (players[i].id == player.id) {
                players.splice(i, 1);
                break;
            }
        }

        io.emit('player disconnected', player.id);
    });
});

http.listen(port, function() {
    console.log('Server started at http://localhost:' + port);
});

