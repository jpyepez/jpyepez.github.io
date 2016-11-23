// Hunter subclass
// Arguments: x, y
function Hunter(x, y) { 
    Boid.call(this, x, y); 
    this.col = addAlpha(palette[1], 100);
    this.maxspeed = 2;
    this.lifespan = random(400, 700);

    this.update = function() {
        this.checkEdges();
        this.vel.add(this.acc);
        this.loc.add(this.vel);
        this.acc.mult(0);

        this.lifespan--;
    }

    this.pursuePrey = function(targets) {
        var pursue_dist = 100;
        var sum = createVector(0, 0);
        var count = 0;

        for (var i = 0, l = targets.boids.length; i < l; i++) {

            var d = p5.Vector.dist(this.loc, targets.boids[i].loc);

            if(d < pursue_dist){
                var diff = p5.Vector.sub(targets.boids[i].loc, this.loc);
                diff.normalize();
                sum.add(diff);
                count++;
            }
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

    this.applyBehaviors = function(boids) {
        var wan = this.wander();
        var pur = this.pursuePrey(prey);
        var coh = this.cohesion(boids);
        var sep = this.separation(boids);
        var ali = this.align(boids);

        // Hard-coded values
        wan.mult(0.75); 
        pur.mult(2.0);
        coh.mult(1.0);
        sep.mult(2.0);
        ali.mult(0.75);

        // Slider values
        // wan.mult(h_wander.value());
        // pur.mult(h_pursue.value());
        // coh.mult(h_cohesion.value());
        // sep.mult(h_separation.value());
        // ali.mult(h_alignment.value());

        this.applyForce(wan);
        this.applyForce(pur);
        this.applyForce(coh);
        this.applyForce(sep);
        this.applyForce(ali);
    }

    this.isAlive = function() {
        if(this.lifespan >= 0)
            return true;
        else
            return false;
    }

    this.display = function() {
        stroke(addAlpha(palette[2], 150));
        fill(this.col);

        push();
        translate(this.loc.x, this.loc.y);
        ellipse(0, 0, this.diam, this.diam);
        pop();
    }
}
