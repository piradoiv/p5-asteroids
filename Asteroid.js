function Asteroid(l, r, v) {
  this.location = createVector(random(width), random(height));
  if (l) {
    this.location = l;
  }
  
  this.radius = random(30, 45);
  if (r) {
    this.radius = r;
  }
  
  this.velocity = p5.Vector.random2D();
  if (v) {
    this.velocity = v;
  }
  this.velocity.mult(1);
  
  this.acceleration = createVector(0, 0);
  this.lines = 10;
  this.shape = [];
  
  for (var i = 0; i < this.lines; i++) {
    var r = random(this.radius - this.radius / 3, this.radius + this.radius / 3);
    var tetha = map(i, 0, this.lines, 0, TWO_PI);
    this.shape.push([sin(tetha) * r, cos(tetha) * r]);
  }
  
  this.update = function() {
    this.location.add(this.velocity);
    this.edges();
  }
  
  this.edges = function() {
    if (this.location.x > width + (this.radius)) {
      this.location.x = 0 - this.radius;
    } else if (this.location.x < 0 - this.radius) {
      this.location.x = width + this.radius;
    }
    
    if (this.location.y > height + (this.radius)) {
      this.location.y = 0 - (this.radius);
    } else if (this.location.y < 0 - (this.radius)) {
      this.location.y = height + (this.radius);
    }
  }
  
  this.draw = function() {
    push();
    stroke(255);
    noFill();
    translate(this.location.x, this.location.y);
    beginShape();
    for (var i = 0; i < this.shape.length; i++) {
      var p = this.shape[i]
      vertex(p[0], p[1]);
    }
    endShape(CLOSE);
    pop();
  }
}
