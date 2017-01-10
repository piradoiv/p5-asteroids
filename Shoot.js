function Shoot(location, angle) {
  this.location = location;
  this.velocity = p5.Vector.fromAngle(angle);
  this.velocity.mult(6);
  this.lifeSpan = 0;
  
  this.update = function() {
    this.location.add(this.velocity);
    this.lifeSpan++;
  }
  
  this.offScreen = function() {
    if (this.location.x > width + 20 ||
      this.location.x < -20 ||
      this.location.y > height + 20 ||
      this.location.y < -20) {
        return true;
    }
    
    return false;
  }

  this.draw = function() {
    push();
    translate(this.location.x, this.location.y);
    rotate(this.velocity.heading());
    stroke(255);
    noFill();
    line(0, 0, 5, 0);
    pop();
  }
}