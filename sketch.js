// P5js Sequencer
// JP Yepez


// Sequencer elements
var seq;
var select_names;
var select;
var global_opt;
var global_opt_pos;
var g_apply;
var options;
var opt_apply;
var select_global;
var button_colors;
var tempo_slider;
var steps_slider;
var res_slider;
var last_steps;
var num_ins;
var button_radius;
var play_fwd;
var play_rev;
var play_rnd;
var play_global;

// Drums
var kick;
var snare;
var hihat_c;
var hihat_o;
var ride;

// Melodic Instruments
var lead;
var bass;

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
var init_width;
var init_height;

// Touch values
var touch;

//===========================================
function preload(){
	// Load sound files
	kick = loadSound('audio/kick_01.wav');
	snare = loadSound('audio/snare_01.wav');
	hihat_c = loadSound('audio/hihat_02.wav');
	hihat_o = loadSound('audio/hihat_04.wav');
}

//===========================================
function setup(){
	init_width = 800;
	init_height = 600;

	createCanvas(init_width, init_height);
	frameRate(60);
	cursor(HAND);
	touch = false;

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
	play_global = 0;

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
	select_names = ["LD", "BS", "OH", "HH", "SD", "KD"];	

	for(var i = 0; i < select.length; i++){
		select[i] = createButton(select_names[i], i);
		select[i].position(20, slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)) - button_radius);
		select[i].mousePressed(set_global);
	}

	button_colors = [color(0, 255, 0), color(0, 0, 255), color(0, 255, 255),
					color(255, 127, 0), color(0, 127, 255), color(255, 0, 255)];

	// Playback mode buttons
	play_fwd = createButton("Fwd", 0);
	play_fwd.position(width * 0.5 + 60, 20);
	play_fwd.mousePressed(set_play);

	play_rev = createButton("Rev", 1);
	play_rev.position(width * 0.5 + 110, 20);
	play_rev.mousePressed(set_play);

	play_rnd = createButton("Rnd", 2);
	play_rnd.position(width * 0.5 + 155, 20);
	play_rnd.mousePressed(set_play);

	// Global options
	global_opt_pos = createVector(width * 0.5 + 60, 50);
	reset_global_opt();
	g_apply = createButton("Apply");
	g_apply.position(global_opt_pos.x + 85, global_opt_pos.y);
	g_apply.mousePressed(apply_global);

	// Instrument options

	// Instrument sequencers
	seq = new Array(num_ins)

	for(var i = 0; i < seq.length; i++){
		seq[i] = new Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
		seq[i].index = i;
	}

	// Melodic Instruments
	lead = new Lead();
	bass = new Bass();
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
// Check/update touch
function checkTouch(){
	if(touchIsDown) touch = true;
	else touch = false;
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

	// Playback mode buttons
	text("Play:", width * 0.5, 20);

	// Actions menu
	text("Actions:", width * 0.5, 50);
}

//===========================================
function set_global(){
	select_global = this.value();
}

//===========================================
function set_play(){
	play_global = this.value();
}

//===========================================
function apply_global(){

	if (global_opt.value() == 'Rand All'){				// Randomize all sequencer buttons
		for(var i = 0; i < seq.length; i++){
			for(var j = 0; j < seq[i].buttons.length; j++){
				var state = boolean(int(random(2)));
				seq[i].buttons[j].on = state;
				seq[i].idle_buttons[j].on = state;
			}
		}
	} else if (global_opt.value() == 'Clear All'){		// Clear all sequencers
		for(var i = 0; i < seq.length; i++){
			seq[i] = new Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
			seq[i].index = i;
		}
	}

	global_opt.remove();
	reset_global_opt();
}

//===========================================
function reset_global_opt(){
	global_opt = createSelect();
	global_opt.position(global_opt_pos.x, global_opt_pos.y);
	global_opt.option('');
	global_opt.option('Rand All');
	global_opt.option('Clear All');
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

	// Array to store button states
	var temp_states = new Array(last_steps);

	if(steps_slider.value() != last_steps){
		for(var i = 0; i < seq.length; i++){
			for(var j = 0; j < seq[i].buttons.length; j++){
				if(seq[i].buttons[j].on) 
					temp_states[j] = true;
				else temp_states[j] = false;
			}

			seq[i] = new Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
			seq[i].index = i;

			for(var j = 0; j < min(seq[i].buttons.length, temp_states.length); j++){
				if(temp_states[j]){
					seq[i].buttons[j].on = true;
					seq[i].idle_buttons[j].on = true;
				} else {
					seq[i].buttons[j].on = false;
					seq[i].idle_buttons[j].on = false;
				}
			}
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
			if(counter < 0)
				counter = steps_slider.value() - 1;

			beat = counter;
			play();
			
			if(play_global == 0) counter ++;
			else if (play_global == 1) counter --;
			else if (play_global == 2) counter = int(random(steps_slider.value()-1));
		}
	}
}

//===========================================
function play(){
	if(seq[0].buttons[beat].on) lead.play();
	if(seq[1].buttons[beat].on) bass.play();
	if(seq[2].buttons[beat].on) hihat_o.play();
	if(seq[3].buttons[beat].on) hihat_c.play();
	if(seq[4].buttons[beat].on) snare.play();
	if(seq[5].buttons[beat].on) kick.play();
}

//===========================================
function mouseReleased(){
	for(var i = 0; i < seq.length; i++){
		seq[i].toggle();	
	}
	touch == false;
}

//===========================================
function windowResized() {

	var temp_width;
	var temp_height;

	if(width > windowWidth){
		temp_width = windowWidth;
	} else temp_width = init_width;

	if(height > windowHeight){
		temp_height = windowHeight;
	} else temp_height = init_height;

	resizeCanvas(temp_width, temp_height);
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

		if(!this.on && this.hover) fill(215, 215, 215);
		else {
			if(this.on) fill(this.c);
			else fill(255);
		}
		if(this.pressed) fill(125, 125, 125);
		stroke(0);
		ellipse(this.x, this.y, this.r * 2.0, this.r * 2.0);
	};

	this.run = function(){
		this.update();
		this.display();
	}

	this.checkHover = function(){
		var mouseDist = dist(this.x, this.y, mouseX, mouseY);
		if(mouseDist < this.r && touch == false){
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

		ellipse(this.x, this.y, this.r * 0.75, this.r * 0.75);
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

//===========================================
// Bass class
// Arguments:
function Bass(){
	this.osc = new p5.Oscillator('sawtooth');
	this.osc.freq(110);
	this.osc.amp(0);
	
	this.filt = new p5.LowPass();
	this.filt.set(800, 1);
	
	this.env = new p5.Env(0.01, 1, 1, 0.5);

	this.osc.disconnect();
	this.osc.connect(this.filt);

	this.osc.start();

	this.play = function(){
		this.env.play(this.osc);
	}
}

//===========================================
// Lead class
// Arguments:
function Lead(){
	this.scale = [57, 59, 60, 62, 64, 65, 67, 69];

	this.osc = new p5.Oscillator('sawtooth');
	this.osc.amp(0);
	
	this.filt = new p5.LowPass();
	this.filt.set(1000, 20);
	
	this.env = new p5.Env(0.01, 1, 1, 0.5);

	this.osc.disconnect();
	this.osc.connect(this.filt);

	this.osc.start();

	this.play = function(){
		this.note = this.scale[(int(random(this.scale.length-1)))];
		this.osc.freq(midiToFreq(this.note + 12));
		this.env.play(this.osc);
	}
}



