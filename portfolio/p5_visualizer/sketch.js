// Introduction to Programming for the Visual Arts
// Audio Visualizer
// JP Yepez
// 07/22/2016
/////////////

// Audio and time management
var audio;
var bpm, fpb;
var drum_cues = [0.1, 1.0, 1.875, 2.5, 3.45, 4.375, 5.0, 5.95, 6.875, 7.5, 8.45, 9.375];
var mel_cues = [0.1, 0.625, 1.0, 5.0, 5.625, 5.95];

// Particle systems
var center;
var mover1, mover2;
var color1, color2;

// Canvas transformations
var o_alpha;
var rot, rot_spd;
var canvas_center;
var hue_counter, hue_d;

// Text layer
var text_layer;
var img;
function preload(){
	audio = loadSound("assets/vessel.m4a");
}

function setup() {
	createCanvas(768, 576);
	pixelDensity(1);

    // dummy RGB color stuff
    if(millis()){
        fill(255, 0, 0);
        rect(random(width), random(height), 10, 10);
        fill(0, 255, 0);
        rect(random(width), random(height), 10, 10);
        fill(0, 0, 255);
        rect(random(width), random(height), 10, 10);
    }

    // Color setup and background
	colorMode(HSB, 360, 100, 100, 255);
	background(0, 0, 0);

	// Text
	text_layer = createGraphics(width, height);
	text_layer.textFont("Cantarell");
	text_layer.textSize(16);


	// Tempo and frames
	bpm = 96.4;
	fpb = 1 / (bpm / 60.0 / 60.0);

	// Initialize global variables
	canvas_center = createVector(width * 0.5, height * 0.5);
	
	color1 = color(120, 100, 100);			// colors
	color2 = color(180, 100, 100);
	
	rot = 0;								// transformations
	hue_counter = 0;
	restart();								// initialize change variables

	// Initialize particle systems
	center = new Source(width * 0.5, height * 0.5, color1);
	
	var mover_loc = createVector(random(0, width), random(0, height));
	var mover_spd = createVector(random(-2, 2), random(-2, 2));
	mover1 = new DSource(mover_loc.x, mover_loc.y, mover_spd, color2);
	mover2 = new DSource(width - mover_loc.x, height - mover_loc.y, p5.Vector.mult(mover_spd, -1), color2);

	// Add audio cues and functions
	audio.addCue(0.1, restart);

	for(var i = 0; i < drum_cues.length; i++){
		audio.addCue(drum_cues[i], drum_hit);
	}

	for(var i = 0; i < mel_cues.length; i++){
		audio.addCue(mel_cues[i], mel_note);
	}

	// Audio setup
	audio.setVolume(0.4);
	audio.loop();
	audio.play();

}

function draw() {
	// background
	noStroke();
	fill(0, 0, 0, o_alpha);
	rect(0, 0, width, height);
	
	// canvas transformation
	rotate_canvas();

	// particle systems
  	center.run();
  	mover1.run();
  	mover2.run();

  	// update hue
  	hue_counter += hue_d;

  	// draw sketch label
  	if(millis() < 7000)
  		draw_label("Vessel", "JP Yepez (Music by Jon Hopkins)");
}

// Particle class
var Cell = function(x, y, spdx, spdy, col) {
	this.diam;
	this.phase = 0;
	this.loc = createVector(x, y);
	this.speed = createVector(spdx, spdy);
	this.isAlive = true;
	this.age = 0;
	this.max_age = random(60, 120);

	this.update = function(){
		this.check_life();
		this.loc.add(this.speed);
		this.diam = 5 + sin(this.phase * 2.0 * PI) * map(this.age, 0, 200, 5, 2);
		this.phase += 1.0/fpb;
	}

	this.display = function(){
		noStroke();
		fill((hue(col) + hue_counter) % 360, saturation(col), brightness(col), map(this.age, 0, 200, 255, 0));
		ellipse(this.loc.x, this.loc.y, this.diam, this.diam);
		noFill();
		for(var i = 0; i < 5; i++){
			strokeWeight(pow(i+1, 2));
			stroke((hue(col) + hue_counter) % 360, saturation(col), brightness(col), 20);
			ellipse(this.loc.x, this.loc.y, this.diam, this.diam);	
		}
		
	}

	this.run = function(){
		this.update();
		this.display();
	}

	this.check_life = function() {
		if(this.loc.x > width || this.loc.x < 0 || this.loc.y > height || this.loc.y < 0){
			this.isAlive = false;
		} else if(this.age > this.max_age){
			this.isAlive = false;
		} else {
			this.age++;
		}
	}
	
}

// Particle system class
var Source = function(x, y, col){
	this.loc = createVector(x, y);
	this.cell_array = Array();

	this.update = function(){
		if(this.cell_array.length > 0){
			for(var i = 0; i < this.cell_array.length; i++){
				if(this.cell_array[i].isAlive == false){
					this.cell_array.splice(i, 1);
				}
			}	
		}
	}

	this.display = function(){
		for(var i = 0; i < this.cell_array.length; i++){
			this.cell_array[i].run();
		}
	}

	this.run = function(){
		this.update();
		this.display();
	}

	this.add = function(){
		var new_num = floor(random(4, 10));
		var angle = 2 * PI / new_num;
		for(var i = 0; i < new_num; i++){
			var new_cell = new Cell(this.loc.x, this.loc.y, 2 * cos(angle * i), 2 * sin(angle * i), col);	
			this.cell_array.push(new_cell);
		}
	}
}

// Moving particle system class
var DSource = function(x, y, o_spd, col){
	Source.call(this, x, y, col);
	this.spd = o_spd;
	this.acc;

	this.update = function(){

		var orbit = this.loc.dist(canvas_center);
		this.acc = p5.Vector.sub(canvas_center, this.loc);
		this.acc.normalize();
		this.acc.mult(0.025);
		this.spd.add(this.acc);

		this.loc.add(this.spd);
		if(this.cell_array.length > 0){
			for(var i = 0; i < this.cell_array.length; i++){
				if(this.cell_array[i].isAlive == false){
					this.cell_array.splice(i, 1);
				}
			}	
		}
	}
}

// Add particles on drum hit
var drum_hit = function() {
	center.add();
}

// Add particles on melody note
var mel_note = function(){
	mover1.add();
	mover2.add();
}

// Transform canvas
var rotate_canvas = function() {
	translate(width*0.5, height*0.5);
	rotate(rot);
  	translate(-width*0.5, -height*0.5);

  	rot += rot_spd;
}

// New global values on audio restart
var restart = function() {
	o_alpha = random(10, 255);
	rot_spd = random(- 0.015, 0.015);
	hue_d = random(2);
}


var draw_label = function(name, artist) {
  text_layer.clear()

  if (frameCount < 360) {
    text_layer.resetMatrix();

    for (var i = 0; i < 400; i++) {
      var interp = map(i, 0, 400, 0, 1);
      var c_from = color(255);
      var c_to = color(0);
      var c = lerpColor(c_from, c_to, pow(interp, 3));
      text_layer.stroke(c);
      text_layer.line(i, height - 110, i, height - 40);
    }

    text_layer.textSize(16);
    text_layer.textStyle(BOLD);
    text_layer.noStroke();
    text_layer.fill(0);
    text_layer.text(name, 15, height-90);

    text_layer.textStyle(ITALIC);
    text_layer.textSize(14);
    text_layer.fill(0);
    text_layer.text(artist, 25, height-70);
    text_layer.text("Intro to Programming for the Visual Arts", 25, height-52);

    resetMatrix();
  	image(text_layer, 0, 0);
  	img = text_layer.get();
  } else {
  	tint(255, constrain(map(400 - frameCount, 0, 40, 0, 255), 0, 255));
  	resetMatrix();
  	image(img, 0, 0);
  }
}
