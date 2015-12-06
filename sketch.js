// P5js Sequencer
// JP Yepez


// Sequencer elements
var seq;
var select_names;
var select;
var select_global;
var button_colors;
var tempo_slider;
var steps_slider;
var res_slider;
var last_steps;
var num_ins;
var button_radius;

// Drums
var kick;
var snare;
var hihat;
var ride;

// Rhythmic elements
var quarter;
var new_beat;
var counter;
var beat;
var time0;

// GUI values
var slider_area;
var sidebar;

// Temporary size values
var temp_width;
var temp_height;

//===========================================
function preload(){
	kick = loadSound('audio/kick_01.wav');
	snare = loadSound('audio/snare_01.wav');
	hihat = loadSound('audio/hihat_01.wav');
}

//===========================================
function setup(){
	temp_width = 800;
	temp_height = 600;

	createCanvas(temp_width, temp_height);
	frameRate(60);

	// Sequencer variables
	num_ins = 6;
	button_radius = 10;

	// GUI variables
	slider_area = 80;
	sidebar = 70;

	// Global variables
	counter = 0;
	time0 = 0;
	select_global = 0;

	// Tempo slider
	tempo_slider = createSlider(60, 200, 120);
	tempo_slider.position(65, 20);

	// Steps slider
	steps_slider = createSlider(4, 16, 8);
	steps_slider.position(65, 50);

	// Resolution slider
	res_slider = createSlider(0, 5, 3);
	res_slider.position(65, 80);
	res_durations = ["Whole", "1/2", "1/4", "1/8", "1/16", "1/32"];

	// Instrument buttons
	select = new Array(num_ins);
	select_names = ["KD", "SD", "HH", "RI", "BS", "LD"];

	for(var i = 0; i < select.length; i++){
		select[i] = createButton(select_names[i], i);
		select[i].position(20, slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)) - button_radius);
		select[i].mousePressed(set_global);
	}

	button_colors = [color(0, 255, 0), color(0, 0, 255), color(0, 255, 255),
					color(255, 127, 0), color(0, 127, 255), color(255, 0, 255)];

	// Instrument sequencers
	seq = new Array(num_ins)

	for(var i = 0; i < seq.length; i++){
		seq[i] = new Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
		seq[i].index = i;
	}
}

//===========================================
function draw(){
	background(0);
	
	labels();

	for(var i = 0; i < seq.length; i++){
		seq[i].run();
	}

	read();
	update_tempo();
	update_steps();
}

//===========================================
// Draw slider labels
function labels(){
	textAlign(LEFT, TOP);
	textSize(14);

	// Tempo slider
	text("Tempo: ", 10, 20);
	text(tempo_slider.value() + " BPM", 205, 20);

	// Steps slider
	text("Steps: ", 10, 50);
	text(steps_slider.value(), 205, 50);

	// Resolution slider
	text("Res:", 10, 80);
	text(res_durations[res_slider.value()], 205, 80);
}

//===========================================
function set_global(){
	select_global = this.value();
}

//===========================================
// Update sequencer tempo
function update_tempo(){
	quarter = 60000.0/tempo_slider.value();

	if((millis() - time0) >= quarter*pow(2.0, 2 - res_slider.value())) {
		new_beat = true;
		time0 = millis();
	} else new_beat = false;
}

//===========================================
// Check step slider value
function update_steps(){

	if(steps_slider.value() != last_steps){
			for(var i = 0; i < seq.length; i++){
			seq[i] = new Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
			seq[i].index = i;
		}
	}

	last_steps = steps_slider.value();
}

//===========================================
function read(){
	if(steps_slider.value() == last_steps){
		if(new_beat){
			
			if(counter >= steps_slider.value())
				counter = 0;

			beat = counter;

			if(seq[0].buttons[beat].on) kick.play();
			if(seq[1].buttons[beat].on) snare.play();
			if(seq[2].buttons[beat].on) hihat.play();
			
			counter ++;
		}
	}
}

//===========================================
function mouseReleased(){
	for(var i = 0; i < seq.length; i++){
		seq[i].toggle();	
	}
}

//===========================================
function windowResized() {
  var resized_width;
  var resized_height;
  
  if(windowWidth < temp_width) 
  	resized_width = windowWidth;
  else resized_width = temp_width;
  
  if(windowHeight < temp_height)
  	resized_height = windowHeight;
  else resized_height = temp_height;
  println(resized_width + " " + resized_height);
  resizeCanvas(resized_width, resized_height);
}

//===========================================
// Button Set class
// Arguments: number of buttons, y position, radius, color
function Button_Set(num_, y_, r_, color_){
	this.buttons = new Array(num_);
	this.idle_buttons = new Array(num_);
	this.hover = false;
	this.hover_offset = 20;
	this.x_box = 0;
	this.y_box = y_ - r_;
	this.w_box = width;
	this.h_box = 2 * r_;
	this.index;

	for(var i = 0; i < num_; i++){
		this.buttons[i] = new Button(sidebar + ((width - sidebar)/(1 + this.buttons.length))*(i+1), y_, r_, color_);
		this.buttons[i].index = i;
		this.buttons[i].parent = this;
		this.idle_buttons[i] = new IdleButton(sidebar + ((width - sidebar)/(1 + this.buttons.length))*(i+1), y_, r_, color_);
		this.idle_buttons[i].index = i;
		this.idle_buttons[i].parent = this;
	}

	this.update = function(){
		this.checkHover();
	}

	this.display = function(){
		if(this.hover) {
			select_global = this.index;
			fill(225, 50);
		}
		else fill(127, 50);
		noStroke();
		rect(this.x_box, this.y_box, this.w_box, this.h_box);
	}

	this.run = function(){
		this.update();
		this.display();

		if(select_global == this.index){
			for(var i = 0; i < num_; i++){
				this.buttons[i].run();
			}
		} else {
			for(var i = 0; i < num_; i++){
				this.idle_buttons[i].run();
			}
		}
	}

	this.checkHover = function(){
		if((mouseX > sidebar + this.x_box) && (mouseX < this.x_box + this.w_box) && (mouseY > (this.y_box - this.hover_offset)) && (mouseY < (this.y_box + this.h_box + this.hover_offset))) {
			this.hover = true;
		} else {
			this.hover = false;
		}
	}

	this.toggle = function(){
		if(select_global == this.index){
			for(var i = 0; i < num_; i++){
				this.buttons[i].toggle();
				this.idle_buttons[i].toggle();
			}
		}
	}
}

//===========================================
// Button class
// Arguments: x position, y position, radius, color
function Button(x_, y_, r_, c_){
	this.x = x_;
	this.y = y_;
	this.r = r_;
	this.c = c_;
	this.t_counter = 0;
	this.on = false;
	this.hover = false;
	this.pressed = false;
	this.index;
	this.parent;

	this.update = function(){
		this.checkHover();
		this.checkPress();
	};

	this.display = function(){
		if(beat == this.index) fill(255, 0, 0);
		else fill(255);
		ellipse(this.x, this.y, this.r * 2.5, this.r * 2.5);

		if(this.hover) fill(255, 255, 0);
		else {
			if(this.on) fill(this.c);
			else fill(255);
		}
		if(this.pressed) fill(125, 125, 0);
		stroke(0);
		ellipse(this.x, this.y, this.r * 2.0, this.r * 2.0);
	};

	this.run = function(){
		this.update();
		this.display();
	}

	this.checkHover = function(){
		var mouseDist = dist(this.x, this.y, mouseX, mouseY);
		if(mouseDist < this.r){
			this.hover = true;
		} else {
			this.hover = false;
		}
	}

	this.toggle = function(){
		if(this.hover){
			this.t_counter++;
			this.on = boolean(this.t_counter % 2);
		}
	}

	this.checkPress = function(){
		if(this.hover){
			if(mouseIsPressed) this.pressed = true;
			else this.pressed = false;
		}
		else this.pressed = false;
	}
}

//===========================================
// Idle Button class
// Arguments: x position, y position, radius, color
function IdleButton(x_, y_, r_, c_){
	this.x = x_;
	this.y = y_;
	this.r = r_;
	this.c = c_;
	this.t_counter = 0;
	this.on = false;
	this.index;
	this.parent;

	this.update = function(){
	}

	this.display = function(){
		if(this.on) {
			if(beat == this.index){
				stroke(this.c);
				fill(this.c);
			} else {
				stroke(0);
				fill(red(this.c), green(this.c), blue(this.c), 100);
			}
		} else {
			stroke(0);
			fill(255);
		}

		ellipse(this.x, this.y, this.r * 0.5, this.r * 0.5);
	};

	this.run = function(){
		this.update();
		this.display();
	}

	this.toggle = function(){
		if(this.parent.buttons[this.index].hover){
			this.t_counter++;
			this.on = boolean(this.t_counter % 2);
		}
	}

}