// Rain class
// Arguments: number of drops
// Simple array of "drops", which are assigned a random velocity.
function Rain(num) {
    this.drops = [];
    this.velocities = []; 

    for (var i = 0, l = num; i < l; i++) {
        var d = createVector(random(width), random(height));
        var v = createVector(-5, random(10, 20));
        this.drops.push(d);
        this.velocities.push(v);
    }

    this.update = function() {
        for (var i = 0, l = this.drops.length; i < l; i++) {
            this.checkEdges(this.drops[i]);
            this.drops[i].add(this.velocities[i]);
        }
    }

    this.display = function() {
        strokeWeight(0.75);
        stroke(127);
        noFill();

        for (var i = 0, l = this.drops.length; i < l; i++) {
            var end = p5.Vector.fromAngle(-PI/4);
            end.mult(5);
            end.add(this.drops[i]);
            line(this.drops[i].x, this.drops[i].y, end.x, end.y);
        }
    }

    this.run = function() {
        this.update();
        this.display();
    }

    this.checkEdges = function(drop) {
        if(drop.x < 0)
            drop.x = width;
        if(drop.x > width)
            drop.x = 0;
        if(drop.y < 0)
            drop.y = height;
        if(drop.y > height)
            drop.y = 0;
    }
}
