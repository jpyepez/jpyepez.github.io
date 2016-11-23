// Boid superclass:
// Arguments: x, y
function Boid(x, y) {
    this.loc = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.diam = 5;
    this.maxspeed = 2;
    this.maxforce = 0.25;
    this.col = color(0);
    this.wandertheta = random(TWO_PI);
    this.arrdist = 40;

    this.update = function() {
        this.checkEdges();
        this.vel.add(this.acc);
        this.loc.add(this.vel);
        this.acc.mult(0);
    }

    this.display = function() {
        noStroke();
        fill(this.col);

        push();
        translate(this.loc.x, this.loc.y);
        ellipse(0, 0, this.diam, this.diam);
        pop();
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    // Steering forces
    this.seek = function(target) {
        var desired = p5.Vector.sub(target, this.loc); 

        var d = desired.mag();
        desired.normalize();

        if(d < this.arrdist) {
            var m = map(d, 0, this.arrdist, 0, this.maxspeed);
            desired.mult(m);
        } else
            desired.mult(this.maxspeed);

        desired.sub(this.vel);
        desired.limit(this.maxforce);

        return desired;
    }

    this.flee = function(target) {
        var dist = 100;
        var desired = p5.Vector.sub(this.loc, target);

        if(desired.magSq() < pow(dist, 2)) {
            desired.setMag(this.maxspeed);

            desired.sub(this.vel);
            desired.limit(this.maxforce);
            return desired;

        } else {
            return createVector(0, 0);
        }
    }

    this.wander = function() {
        var wanderR = 15;
        var wanderD = 10;
        var theta_d = 0.25;
        this.wandertheta += random(-theta_d, theta_d);

        var circleloc = this.vel.copy();
        circleloc.setMag(wanderD);
        circleloc.add(this.loc);

        var circleOffset = createVector(wanderR * cos(this.wandertheta), wanderR * sin(this.wandertheta));
        var target = p5.Vector.add(circleloc, circleOffset);

        return this.seek(target);
    }


    this.cohesion = function(boids) {
        var d_lim = 50;
        var sum = createVector(0, 0);
        var count = 0;

        for (var i = 0, l = boids.length; i < l; i++) {

            var diff = p5.Vector.sub(boids[i].loc, this.loc);

            if((diff.magSq() > 0) && (diff.magSq() < pow(d_lim, 2))) {
                sum.add(boids[i].loc);
                count++;
            }
        }

        if(count > 0) {
            sum.div(count);
            return this.seek(sum);
        } else 
            return createVector(0, 0);
    }

    this.separation = function(boids) {
        var d_sep = this.diam + 10;
        var sum = createVector(0, 0);
        var count = 0;

        for (var i = 0, l = boids.length; i < l; i++) {

            var d = p5.Vector.dist(this.loc, boids[i].loc);

            if((d > 0) && (d < d_sep)) {
                var diff = p5.Vector.sub(this.loc, boids[i].loc);
                diff.normalize();
                diff.div(d);
                sum.add(diff);
                count++;
            }
        }  

        if(count > 0) {
            sum.div(count);
            sum.setMag(this.maxspeed);

            var steer = p5.Vector.sub(sum, this.vel);
            steer.limit(this.maxforce);
            return steer;
        } else
            return createVector(0, 0);
    }

    this.align = function(boids) {
        var d_limit = 50;
        var sum = createVector(0, 0);
        var count = 0;

        for (var i = 0, l = boids.length; i < l; i++) {

            var diff = p5.Vector.sub(this.loc, boids[i].loc); 

            if((diff.magSq() > 0) && (diff.magSq() < pow(d_limit, 2))) {
                sum.add(boids[i].vel);
                count++;
            }

            if(count > 0){
                sum.div(count);
                sum.setMag(this.maxspeed);

                var steer = p5.Vector.sub(sum, this.vel);
                steer.limit(this.maxforce);
                return steer;
            } else
                return createVector(0, 0);
        }
    }

    // Check screen edges
    this.checkEdges = function() {
        if(this.loc.x > width) 
            this.loc.x = 0;
        if(this.loc.x < 0)
            this.loc.x = width;
        if(this.loc.y > height)
            this.loc.y = 0;
        if(this.loc.y < 0)
            this.loc.y = height;
    }
}
