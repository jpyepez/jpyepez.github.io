
// The Nature of Code
// Physics: "əˌlektrōˈstadik"
// JP Yepez
// 10/26/16
/////////////

// Coulomb's Law
// Fe = (K * q1 * q2)/r^2

// Palette link:
// http://www.colourlovers.com/palette/4343926/Octopus
var palette;

var p;
var m;
var bg;

function preload() {
    // Load background
    bg = loadImage('assets/noise_bg-02.jpg');
}

function setup() {
    createCanvas(800, 600);
    noCursor();

    // Populate palette
    palette = ['#E8A6D6', '#753687', '#5884B5', '#38336B', '#0A1B35'];
    background(palette[3]);
    
    // Initialize systems
    p = new Particle_Sys(50, 3);
    m = new Magnet_Sys(30);
}

function draw() {
    draw_bg();    // background
    m.display();  // magnet system
    p.run();      // particle system 
}

// Particle class
// Arguments: x, y, charge, parent particle system
function Particle(x, y, q, par) {
    this.loc = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.charge = q;
    this.radius = 3;
    this.col;
    this.isAlive = true;
    this.parent = par;
    
    // Dummy variables, using charge instead of mass
    this.mass = 1;
    var mass = 1;

    // Set color according to polarity
    var polarity = (this.charge >= 0) ? true : false;
    if(polarity)
        this.col = palette[2];
    else
        this.col = palette[0];

    this.col = addAlpha(this.col, map(abs(this.charge), 0, this.parent.maxCharge, 100, 255));

    // Particle physics
    this.update = function(particle) {
        this.vel.add(this.acc);
        this.vel.limit(5);
        this.loc.add(this.vel);
        this.acc.set(0, 0);
    }

    // Apply glow and render ellipse
    this.display = function() {
        noFill();
        for(var i = 0; i < 3; i++) {
            strokeWeight(pow(i + 1, 2));
            stroke(addAlpha(this.col, 40));
            ellipse(this.loc.x, this.loc.y, this.radius * 2, this.radius * 2); 
        }
        
        noStroke(); 
        fill(addAlpha(this.col, 150));
        ellipse(this.loc.x, this.loc.y, this.radius * 2, this.radius * 2); 
    }

    // Apply force to particle
    this.applyForce = function(force) {
        this.acc.add(force);
    }

    // Calculate electrostatic force and apply FROM each particle
    this.electro = function(particle) {
        var r = p5.Vector.dist(this.loc, particle.loc);
        var mag = 5 * ((this.charge * particle.charge)/pow(r, 2));
        mag = constrain(mag, -1, 1);
        var fe = p5.Vector.sub(this.loc, particle.loc);
        fe.setMag(mag);
        return fe;
    }

    // Check if particle is still inside the canvas
    this.isAlive = function() {
        if(this.loc.x < 0 || this.loc.x > width || this.loc.y < 0 || this.loc.y > height)
            return false;
        else
            return true;
    }
}

// Origin Class
// Arguments: x, y, parent particle system
function Origin(x, y, par) {
    this.loc;
    this.parent = par;
    this.phase = random(TWO_PI);
    this.rate_div = random(-100, 100);
    this.rate = floor(random(25, 40));

    // Origin movement following lissajous pattern
    this.update = function() {
        x = width * 0.5 + height * 0.4 * sin(par.o_a * frameCount/2*this.rate_div + this.phase);
        y = height * 0.5 + height * 0.4 * sin(par.o_b * frameCount/2*this.rate_div + this.phase);
        this.loc = createVector(x, y);
    }

    // Blink every time a particle is added 
    this.display = function() {
        if(frameCount % this.rate == 0){
            noStroke();
            fill(255, 200);
            ellipse(this.loc.x, this.loc.y, 15, 15);
        }
    }
}

// Particle System Class
// Arguments: number of initial particles, number of origin pairs, add particle interval
function Particle_Sys(num, origin_num) {
    this.p_origin = [];
    this.n_origin = [];
    this.particles = [];
    this.o_a = floor(random(10));
    this.o_b = floor(random(10));
    this.maxCharge = 10;

    // Push initial paticles
    for(var i = 0; i < num; i++){
        this.particles[i] = new Particle(random(0, width), random(0, height), random(-this.maxCharge, this.maxCharge), this); 
    }

    for(var i = 0; i < origin_num; i++){
        var pos_or = new Origin(random(width), random(height), this);
        var neg_or = new Origin(random(width), random(height), this);
        this.p_origin.push(pos_or);
        this.n_origin.push(neg_or);
    }
    
    // Physics engine
    this.physics = function() {
        // Apply force from magnets
        this.particles.forEach(function(particle, idx, part_array){
            m.magnets.forEach(function(magnet){
                particle.applyForce(magnet.electroMagnet(particle));
            })
        })
        // Apply force from other particles
        this.particles.forEach(function(particleA, idx, part_array){
            part_array.forEach(function(particleB) {
                if(particleA != particleB)
                    particleA.applyForce(particleA.electro(particleB));  
            })
        }) 
    }

    // Update particle system 
    this.update = function() {
        this.cleanUp();
        this.p_origin.forEach(function(origin){
            origin.update();
        });
        this.n_origin.forEach(function(origin){
            origin.update();
        });
            this.add();

        this.physics();
        this.particles.forEach(function(particle){
            particle.update();
        })
    }

    // Render particle system
    this.display = function() {
        this.p_origin.forEach(function(origin){
            origin.display();
        });
        this.n_origin.forEach(function(origin){
            origin.display();
        });

        this.particles.forEach(function(particle){
            particle.display();
        })
    }

    // Run function
    this.run = function() {
        this.update();
        this.display();
    }

    // Add particles at set origin rates
    this.add = function() {
        for(var i = 0; i < origin_num; i++){
            if(frameCount % this.p_origin[i].rate == 0){
                var pos =  new Particle(this.p_origin[i].loc.x, this.p_origin[i].loc.y, random(0, this.maxCharge), this); 
                this.particles.push(pos);
            }
            if(frameCount % this.n_origin[i].rate == 0){
                var neg =  new Particle(this.n_origin[i].loc.x, this.n_origin[i].loc.y, random(0, -this.maxCharge), this); 
                this.particles.push(neg);
            }
        }
    }

    // Clean up dead particles
    this.cleanUp = function() {
        this.particles = this.particles.filter(function(part, idx){
            return part.isAlive(); 
        })

        // Debug: Print particles and frame rate
        // println(this.particles.length, frameRate());
    }
}

// Magnet class
// Arguments: x, y, charge, parent magnet system
function Magnet(x, y, q, par) {
    this.loc = createVector(x, y);
    this.charge = q;
    this.size = 10;
    this.col;
    this.parent = par;

    // Dummy variables, using charge instead of mass
    this.mass = 1;
    var mass = 1;

    // Set color according to polarity
    var polarity = (this.charge >= 0) ? true : false;
    if(polarity)
        this.col = palette[2];
    else
        this.col = palette[0];

    this.col = addAlpha(this.col, map(abs(this.charge), 0, this.parent.maxCharge, 100, 255));

    // Calculate electrostatic force and apply TO particles
    this.electroMagnet = function(particle) {
        var r = p5.Vector.dist(this.loc, particle.loc);
        var mag = 5 * ((this.charge * particle.charge)/pow(r, 2));
        mag = constrain(mag, -1, 1);
        var fe = p5.Vector.sub(particle.loc, this.loc);
        fe.setMag(mag);
        return fe;
    }
    
    // Apply glow and render ellipse
    this.display = function() {
        noFill();
        for(var i = 0; i < 3; i++) {
            strokeWeight(pow(i + 1, 2));
            stroke(addAlpha(this.col, 50));
            ellipse(this.loc.x, this.loc.y, this.size * 2, this.size * 2); 
        }

        noStroke();
        fill(addAlpha(this.col, 150));
        ellipse(x, y, this.size * 2, this.size * 2);
    }
}

// Magnet System Class
// Arguments: number of magnets
function Magnet_Sys(num) {
    this.magnets = [];
    this.maxCharge = 20;

    // Initialize magnets
    for(var i = 0; i < num; i++){
        this.magnets[i] = new Magnet(random(0, width), random(0, height), random(-this.maxCharge, this.maxCharge), this);
    }

    // Render Magnets
    this.display = function() {
        this.magnets.forEach(function(magnet){
            magnet.display();
        })
    }
}

// Add alpha to color
function addAlpha(col, alpha) {
    col = color(col);
    return color(red(col), green(col), blue(col), alpha);
}

// Draw background
function draw_bg() {
    background(bg, 0, 0);
}
