function Camera(target) {
    this.location = createVector(0, 0);
    this.target = target;

    this.update = function() {
        this.location = createVector(
            this.target.x - width / 2,
            this.target.y - height / 2
        );
    }

    this.draw = function() {
    }
}

