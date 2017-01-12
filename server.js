var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Victor = require('victor');

var port = 3000;
var players = [];

app.use(express.static('public'));

io.on('connection', function(socket) {
    var player = new Player(socket);

    console.log('Player #' + player.id + ' connected');
    players.push(player);

    socket.emit('setup', {
        id: player.id
    });

    socket.on('accelerate', function(msg) {
        var v = new Victor(0.1, 0);
        v.rotate(player.heading);
        player.acceleration.add(v);
    });

    socket.on('rotate left', function(msg) {
        player.heading -= 0.1;
    });

    socket.on('rotate right', function(msg) {
        player.heading += 0.1;
    });

    socket.on('disconnect', function() {
        console.log('Player #' + player.id + ' disconnected');
        for (var i = players.length -1; i >= 0; i--) {
            if (players[i].id == player.id) {
                players.splice(i, 1);
                break;
            }
        }
    });
});

http.listen(port, function() {
    console.log('Server started at http://localhost:' + port);
    update();
});

function update() {
    var data = [];
    for (var i in players) {
        var p = players[i];
        p.update();
        data.push({
            id: p.id,
            location: p.location.toObject(),
            heading: p.heading
        });
    }

    io.emit('update', data);
    setTimeout(update, 1000/60);
}

function Player(socket) {
    this.id = socket.id;
    this.socket = socket;
    this.location = new Victor(0, 0);
    this.velocity = new Victor(0, 0);
    this.acceleration = new Victor(0, 0);
    this.heading = 0;

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(8, 0.75);
        this.location.add(this.velocity);
        this.acceleration.limit(0, 0);
    }
}

