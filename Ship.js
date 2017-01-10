function Ship(l) {
  this.location = l;
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  this.heading = 0;
  this.topSpeed = 10;
  this.boosting = 0;
  this.shield = 100;

  this.width = 5;
  this.height = 8;

  this.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topSpeed);
    this.location.add(this.velocity);
    this.edges();
    this.acceleration.mult(0);
    if (this.boosting > 0) {
      this.boosting *= .9;
    }

    if (this.shield > 0) {
      this.shield *= 0.02;
    }
  }

  this.turnLeft = function() {
    this.heading -= 0.1;
  }

  this.turnRight = function() {
    this.heading += 0.1;
  }

  this.power = function() {
    this.acceleration = p5.Vector.fromAngle(this.heading);
    this.acceleration.mult(0.1, 0);
    this.boosting = 10;
  }

  this.edges = function() {
    if (this.location.x > width) {
      this.location.x = 0;
    } else if (this.location.x < 0) {
      this.location.x = width;
    }

    if (this.location.y > height) {
      this.location.y = 0;
    } else if (this.location.y < 0) {
      this.location.y = height;
    }
  }

  this.draw = function() {
    push();
    translate(this.location.x, this.location.y);
    rotate(this.heading - HALF_PI);
    stroke(255);
    if (this.shield > 0) {
      stroke(255, map(sin(frameCount * 0.5), 0, 1, 100, 255));
    }
    noFill();
    triangle(-this.width, -this.height, this.width, -this.height, 0, this.height);

    if (this.boosting > .5) {
      translate(0, -10);
      for (var i = 0; i < random(3, 6); i++) {
        line(random(2, -2), -random(this.boosting), 0, 0);
      }
    }

    pop();
  }
}

