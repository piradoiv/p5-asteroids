var ship;
var asteroids = [];
var shoots = [];
var level = 0;
var score = 0;
var lives = 5;
var gameOver = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(48);
  respawn();
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
}

function nextLevel() {
  level++;
  for (var i = 0; i < level * 2; i++) {
    asteroids.push(new Asteroid());
  }
}

function draw() {
  background(0);
  
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
    } else if (keyIsDown(RIGHT_ARROW)) {
      ship.turnRight();
    }
    
    if (keyIsDown(UP_ARROW)) {
      ship.power();
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
  
  if (asteroids.length == 0) {
    nextLevel();
  }
  
  showScore();
  showLives();
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
    respawn();
  }
}

function keyTyped() {
  if (key == ' ' && !gameOver) {
    shoots.push(new Shoot(createVector(ship.location.x, ship.location.y), ship.heading));
  }
}
