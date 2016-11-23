// PreyFlock subclass
function PreyFlock() {
    Flock.call(this);
    this.counter = 0;
    this.c_rep = 500;

    this.update = function() {
        this.cleanup();
        this.flockRep();
        this.boids.forEach(function(b, idx, boids){
            b.applyBehaviors(boids);
            b.update();
        }) 
        this.counter++;
    }

    this.add = function(x,y) {
        b = new Prey(x, y);
        this.boids.push(b);
    }

    this.cleanup = function() {
        this.boids = this.boids.filter(function(b){
            if(!b.isAlive()) {

                // Visual cue to add hunter
                noStroke();
                fill(palette[0]);
                ellipse(b.loc.x, b.loc.y, 30, 30);

                var amt = floor(random(5, 10));

                for (var i = 0, l = amt; i < l; i++) {
                    if(hunters.boids.length <= 100)
                        hunters.add(b.loc.x, b.loc.y);
                }
            } 
            return b.isAlive();
        }) 
    }

    // Key function
    // Replicate and add boids at consumption (hunters)/intervals (prey)
    this.flockRep = function() {
        if(frameCount % 480 == 0){
            for (var i = 0, l = floor(random(2,4)); i < l; i++) {
                if(this.boids.length <= 20)
                    this.add(random(width), random(height));
            }
        }

        if(this.boids.length > 0) {
            if(this.counter >= this.c_rep){
                for (var i = 0, l = this.boids.length; i < l; i++) {
                    if(this.boids.length <= 20)
                        this.add(this.boids[i].loc.x, this.boids[i].loc.y);
                }
                this.counter = 0;
            }
        } 
    }
}
