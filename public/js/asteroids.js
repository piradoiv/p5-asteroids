var ship;
var camera2d;
var asteroids = [];
var shoots = [];
var level = 0;
var score = 0;
var lives = 5;
var gameOver = false;
var players = [];
var you;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(48);
  respawn();
  camera2d = new Camera(ship.location);
  ship.shield = 0;
  nextLevel();
}

function respawn() {
  lives--;
  if (lives <= 0) {
    gameOver = true;
    return false;
  }

  ship = new Ship(createVector(width / 2, height / 2));
  camera2d = new Camera(ship.location);
}

function nextLevel() {
  level++;
  for (var i = 0; i < level * 2; i++) {
    asteroids.push(new Asteroid());
  }
}

function draw() {
  background(0);
  showScore();
  showLives();

  camera2d.update();
  translate(-camera2d.location.x, -camera2d.location.y);
  camera2d.draw();

  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].update();
    asteroids[i].draw();
  }

  shootsFor:
  for (var i = shoots.length - 1; i >= 0; i--) {
    shoots[i].update();
    shoots[i].draw();
    if (shoots[i].offScreen()) {
      shoots.splice(i, 1);
      continue;
    }

    for (var j = asteroids.length - 1; j >= 0; j--) {
      if (shoots[i].location.dist(asteroids[j].location) < asteroids[j].radius) {
        score += shoots[i].lifeSpan * level;
        var a = asteroids[j];
        var v = createVector(a.location.x, a.location.y);
        if (a.radius > 20) {
          for (var k = 0; k < 2; k++) {
            var newAsteroid = new Asteroid(v.copy(), a.radius * .7);
            newAsteroid.location.add(random(a.radius * 1.5), random(a.radius * 1.5));
            asteroids.push(newAsteroid);
          }
        }

        shoots.splice(i, 1);
        asteroids.splice(j, 1);
        break shootsFor;
      }
    }
  }

  if (ship) {
    if (keyIsDown(LEFT_ARROW)) {
      ship.turnLeft();
      var p = {
          location: {x: ship.location.x, y: ship.location.y},
          velocity: {x: ship.velocity.x, y: ship.velocity.y},
          acceleration: {x: ship.acceleration.x, y: ship.acceleration.y},
          heading: ship.heading
      };
      socket.emit('accelerate', p);
    } else if (keyIsDown(RIGHT_ARROW)) {
      ship.turnRight();
    }

    if (keyIsDown(UP_ARROW)) {
      ship.power();
      var p = {
          location: {x: ship.location.x, y: ship.location.y},
          velocity: {x: ship.velocity.x, y: ship.velocity.y},
          acceleration: {x: ship.acceleration.x, y: ship.acceleration.y},
          heading: ship.heading
      };
      socket.emit('accelerate', p);
    }

    ship.update();
    ship.draw();
    var loc = ship.location;
    if (ship.shield <= 0) {
      for (var i = 0; i < asteroids.length; i++) {
        if (asteroids[i].location.dist(loc) < asteroids[i].radius) {
          respawn();
        }
      }
    }
  }

  for (i = 0; i < players.length; i++) {
    var current = players[i];
    if (current.id == you) {
        continue;
    }

    var s = players[i].ship;
    if (s) {
        s.draw();
    }
  }

  if (asteroids.length == 0) {
    nextLevel();
  }

  if (gameOver == true) {
    showGameOver();
  }
}

function showScore() {
  push();
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(30);
  text("Score: " + score, width / 2, 40);
  pop();
}

function showLives() {
  push();
  translate(25, 25);
  for (var i = 0; i < lives - 1; i++) {
    triangle(-5, -8, 5, -8, 0, 8);
    translate(20, 0);
  }
  pop();
}

function showGameOver() {
  ship = undefined;
  push();
  fill(255, map(sin(frameCount * 0.15), 0, 1, 255, 150));
  noStroke();
  textSize(80);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2 + 40);
  textSize(25);
  fill(255);
  text("Press enter to play again", width / 2, height / 2 + 80);
  pop();
}

function keyPressed() {
  if (gameOver && keyCode == ENTER) {
    gameOver = false;
    lives = 4;
    score = 0;
    level = 0;
    asteroids = [];
    nextLevel();
    respawn();
  }
}

function keyTyped() {
  if (key == ' ' && !gameOver) {
    shoots.push(new Shoot(createVector(ship.location.x, ship.location.y), ship.heading));
  }
}

var socket = io();
socket.on('setup', function(msg) {
  you = msg.id;

  for (var i = 0; i < msg.players.length; i++) {
      var s = new Ship();
      var player = msg.players[i];
      s.location = createVector(player.location.x, player.location.y);
      s.velocity = p5.Vector.fromAngle(player.velocity.angle);
      s.velocity.mult(player.velocity.magnitude);
      s.acceleration = p5.Vector.fromAngle(player.acceleration.angle);
      s.acceleration.mult(player.acceleration.magnitude);

      players.push({
          id: player.id,
          ship: s
      });
  }
});

socket.on('new player', function(player) {
  var s = new Ship();
  s.location = createVector(player.location.x, player.location.y);
  s.velocity = p5.Vector.fromAngle(player.velocity.angle);
  s.velocity.mult(player.velocity.magnitude);
  s.acceleration = p5.Vector.fromAngle(player.acceleration.angle);
  s.acceleration.mult(player.acceleration.magnitude);

  players.push({
      id: player.id,
      ship: s
  });
});

socket.on('moving', function(player) {
  for (var i = 0; i < players.length; i++) {
      if (players[i].id == player.id) {
          var s = new Ship();
          s.location = createVector(player.location.x, player.location.y);
          s.velocity = p5.Vector.fromAngle(player.velocity.angle);
          s.velocity.mult(player.velocity.magnitude);
          s.acceleration = p5.Vector.fromAngle(player.acceleration.angle);
          s.acceleration.mult(player.acceleration.magnitude);
          s.heading = player.heading;

          players[i].ship = s;
      }
  }
});

socket.on('player disconnected', function(id) {
  for (var i = players.length - 1; i >= 0; i--) {
    if (players[i].id == id) {
      players.splice(i, 1);
    }
  }
});

