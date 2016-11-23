// HunterFlock subclass
function HunterFlock() {
    Flock.call(this);

    this.update = function() {
        this.safety();
        this.cleanup();
        this.boids.forEach(function(b, idx, boids){
            b.applyBehaviors(boids);
            b.update();
        }) 
    }

    this.add = function(x, y) {
        b = new Hunter(x, y);
        this.boids.push(b);
    }

    this.cleanup = function() {
        this.boids = this.boids.filter(function(b){
            return b.isAlive();
        }) 
    }

    this.safety = function() {
        if(this.boids.length <= 0) {
            var pos = createVector(random(width), random(height));
            for (var i = 0, l = 50; i < l; i++) {
                this.add(pos.x, pos.y);
            }
        }
    }
}
