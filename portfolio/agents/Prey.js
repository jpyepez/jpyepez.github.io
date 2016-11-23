// Prey subclass
// Arguments: x, y
function Prey(x, y) { 
    Boid.call(this, x, y); 
    this.col = addAlpha(color(255), 150);
    this.diam = 8;
    this.maxspeed = random(2.5, 3.5); 

    this.update = function() {
        if(hunters.boids.length > 0)
            this.checkHunt(hunters);

        this.checkEdges();
        this.vel.add(this.acc);
        this.loc.add(this.vel);
        this.acc.mult(0);

        this.counter++;
    }

    this.fleeHunt = function(chasers) {
        var flee_dist = 100;  
        var sum = createVector(0, 0);
        var count = 0;

        for (var i = 0, l = chasers.boids.length; i < l; i++) {
            var d = p5.Vector.dist(this.loc, chasers.boids[i].loc);

            if (d < flee_dist) {
                var diff = p5.Vector.sub(this.loc, chasers.boids[i].loc); 
                diff.normalize();
                sum.add(diff);               
                count++;
            }

            if(count > 0) {
                sum.div(count);
                sum.setMag(this.maxspeed);

                sum.sub(this.vel);
                sum.limit(this.maxforce);
                return sum;
            } else
                return createVector(0, 0);
        }

    }

    this.checkHunt = function(chasers) {

        for (var i = 0, l = chasers.boids.length; i < l; i++) {
        
            var d = p5.Vector.dist(this.loc, chasers.boids[i].loc);

            if(d <= (this.diam * 0.5)) {
                this.diam -= 0.25;
                this.diam = constrain(this.diam, 0, 10);
            }
        }
    }

    this.isAlive = function() {
        if(this.diam >= 5)
            return true;
        else
            return false;
    }

    this.applyBehaviors = function(boids) {
        var wan = this.wander();

        if(hunters.boids.length > 0)
            var fle = this.fleeHunt(hunters);

        var coh = this.cohesion(boids);
        var sep = this.separation(boids);
        var ali = this.align(boids);

        // Hard-coded values
        wan.mult(1.0); 

        if(hunters.boids.length > 0)
            fle.mult(3.0);

        coh.mult(0.25);
        sep.mult(1.5);
        ali.mult(1);

        // Slider values
        // wan.mult(p_wander.value());

        // if(hunters.boids.length > 0)
        //     fle.mult(p_flee.value());

        // coh.mult(p_cohesion.value());
        // sep.mult(p_separation.value());
        // ali.mult(p_alignment.value());

        this.applyForce(wan);

        if(hunters.boids.length > 0)
            this.applyForce(fle);

        this.applyForce(coh);
        this.applyForce(sep);
        this.applyForce(ali);
    }

}
