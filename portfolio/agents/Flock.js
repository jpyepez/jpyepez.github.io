// Flock superclass
function Flock() {
    this.boids = [];

    // Initialize with 'num' boids
    this.init = function(num) {
        for (var i = 0, l = num; i < l; i++) {
            this.add(random(width), random(height));
        }
    }

    this.display = function() {
        this.boids.forEach(function(b){
            b.display();
        }) 
    }

    this.run = function() {
        this.update();
        this.display();
    }
}
