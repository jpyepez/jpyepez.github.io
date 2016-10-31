
// The Nature of Code
// Random Walker: "Origins"
// JP Yepez
// 10/15/2016
/////////////

var walker_system;

function setup() {
    createCanvas(640, 480); 
    colorMode(HSB, 360, 100, 100);
    background(360, 0, 100);

    // Initialize system
    walker_system = new Walker_Sys(10);
}

function draw() {
    // Run system
    walker_system.run();
}

// Walker System Class
function Walker_Sys(num) {
    this.walkers = [];
    this.rate = random(0.01, 0.001);
    this.hue = random(360);
    this.walker_speed = random(0.0025, 0.005);
    this.colorA = color(this.hue, random(30, 100), random(30, 100), 0.05);
    this.colorB = color(this.hue, random(30, 100), random(30, 100), 0.05);

    // Color interpolation
    this.color_d = 1.0/num;

    // Initialize with num walkers
    for(var i = 0; i < num; i++) {
        this.walkers.push(new Walker(width * 0.5, height * 0.5, this.rate, this.walker_speed, lerpColor(this.colorA, this.colorB, this.color_d * i)));
    }

    // Class functions

    this.update = function() {
        this.cleanUp();
        this.add();
        this.walkers.forEach(function(w) {
            w.update();
        })
    }

    this.display = function() {
        this.walkers.forEach(function(w) {
            w.display();
        })
    }

    this.run = function() {
        this.update();
        this.display();
    }

    this.add = function() {
        this.walkers.push(new Walker(width * 0.5, height * 0.5, this.rate, this.walker_speed, lerpColor(this.colorA, this.colorB, this.color_d * random(1))));
    }

    this.cleanUp = function() {
        // println(this.walkers.length);
        this.walkers = this.walkers.filter(function(w, idx){
            return w.isAlive(); 
        })
    }
}

// Walker class
function Walker(x, y, rate, speed, col) {
    this.loc = createVector(x, y);
    this.vel = createVector(0, 0);
    this.angle_o = random(1);

    // Class functions    

    this.update = function() {
        this.acc = p5.Vector.fromAngle(map(noise((frameCount*rate) + this.angle_o), 0, 1, -TWO_PI, TWO_PI));
        this.acc.setMag(speed);
        this.vel.add(this.acc);
        this.loc.add(this.vel);
    }

    this.display = function() {
        push();
        translateVec(this.loc);
        strokeWeight(1);
        noStroke();
        fill(col);
        ellipse(0, 0, 1, 1);
        pop();
    }

    this.isAlive = function() {
        if(this.loc.x < 0 || this.loc.x > width || this.loc.y < 0 || this.loc.y > height)
            return false;
        else
            return true;
    }
}

// Function: Translate using vector coordinates
function translateVec(vec) {
    translate(vec.x, vec.y);
}

