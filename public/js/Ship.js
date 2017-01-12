function Ship(l) {
  this.location = l;
  this.heading = 0;
  this.width = 5;
  this.height = 8;

  this.update = function() {}

  this.draw = function() {
    push();
    translate(this.location.x, this.location.y);
    rotate(this.heading - HALF_PI);
    stroke(255);
    noFill();
    triangle(-this.width, -this.height, this.width, -this.height, 0, this.height);
    pop();
  }
}

