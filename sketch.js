// P5js Sequencer
// JP Yepez
console.log("fix6");
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
var div_slider;
var vol_slider;
var last_steps;
var num_ins;
var button_radius;
var play_fwd;
var play_rev;
var play_rnd;
var play_global;
var play_button;
var melody_lead;
var melody_bass;

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
var play_state;

// GUI values
var slider_area;
var sidebar;
var right_offset;

// Temporary size values
var init_width;
var init_height;

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

	// Sequencer variables
	num_ins = 6;
	button_radius = 10;

	// GUI variables
	slider_area = 80;
	sidebar = 70;
	right_offset = 150;

	// Global variables
	counter = 0;
	time0 = 0;
	select_global = 0;
	play_global = 0;
	play_state = false;

	// Play/Stop Button
	play_button = new Play(width * 0.5 + 20, 40, 40, 40);
	rew_button = new Rew(width * 0.5 - 60, 40, 40, 40);

	// Tempo slider
	tempo_slider = createSlider(60, 200, 120);
	tempo_slider.position(75, 20);

	// Steps slider
	steps_slider = createSlider(4, 16, 8);
	steps_slider.position(75, 50);

	// Resolution slider
	div_slider = createSlider(0, 5, 3);
	div_slider.position(75, 80);
	div_durations = ["Whole", "1/2", "1/4", "1/8", "1/16", "1/32"];

	// Master Volume slider
	vol_slider = createSlider(0, 100, 50);
	vol_slider.position(width * 0.5 + 60 + right_offset, 20);

	// Instrument buttons
	select = new Array(num_ins);
	select_names = ["LD", "BS", "OH", "HH", "SD", "KD"];	

	for(var i = 0; i < select.length; i++){
		select[i] = createButton(select_names[i], i);
		select[i].position(20, slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)) - button_radius);
		select[i].mousePressed(set_global);
	}

	// Melody editor buttons
	melody_lead = createButton("LD Edit");
	melody_lead.position(50, slider_area + 90);
	melody_lead.mousePressed(toggle_ld_edit);
	
	melody_bass = createButton("BS Edit");
	melody_bass.position(50, slider_area + 165);
	melody_bass.mousePressed(toggle_bs_edit);

	// Playback mode buttons
	play_fwd = createButton("Fwd", 0);
	play_fwd.position(width * 0.5 + 60 + right_offset, 50);
	play_fwd.mousePressed(set_play);

	play_rev = createButton("Rev", 1);
	play_rev.position(width * 0.5 + 110 + right_offset, 50);
	play_rev.mousePressed(set_play);

	play_rnd = createButton("Rnd", 2);
	play_rnd.position(width * 0.5 + 155 + right_offset, 50);
	play_rnd.mousePressed(set_play);

	// Global options
	global_opt_pos = createVector(width * 0.5 + 60 + right_offset, 80);
	reset_global_opt();
	g_apply = createButton("Apply");
	g_apply.position(global_opt_pos.x + 85, global_opt_pos.y);
	g_apply.mousePressed(apply_global);

	// Instrument sequencers
	seq = new Array(num_ins)

	// Sequencer button colors
	button_colors = [color(0, 255, 0), color(0, 0, 255), color(0, 255, 255),
					color(255, 127, 0), color(0, 127, 255), color(255, 0, 255)];

	for(var i = 0; i < seq.length; i++){
		if(i == 0){
			seq[i] = new Ld_Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
		} else if (i == 1) {
			seq[i] = new Bs_Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
		} else
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

	play_button.run();
	rew_button.run();

	if(!seq[0].editor.ed_mode && !seq[1].editor.ed_mode){
		for(var i = 0; i < seq.length; i++){
			seq[i].run();
		}
	} else if(seq[0].editor.ed_mode) 
		seq[0].run_editor();
	else if(seq[1].editor.ed_mode)
		seq[1].run_editor();

	read();
	update_tempo();
	update_steps();
	update_vol();
}

//===========================================
// Draw slider labels
function labels(){
	textAlign(LEFT, TOP);
	textSize(14);

	// Tempo slider
	text("Tempo: ", 10, 20);
	text(tempo_slider.value() + " BPM", 215, 20);

	// Steps slider
	text("Steps: ", 10, 50);
	text(steps_slider.value(), 215, 50);

	// Resolution slider
	text("Time Div:", 10, 80);
	text(div_durations[div_slider.value()], 215, 80);

	// Master Volume slider
	text("Volume:", width * 0.5 + right_offset, 20);

	// Playback mode buttons
	text("Play:", width * 0.5 + right_offset, 50);

	// Actions menu
	text("Actions:", width * 0.5 + right_offset, 80);
	
	// Playback mode indicator
	switch(int(play_global)) {
		case 0:
			noFill();
			stroke(255);
			strokeWeight(2);
			rect(width * 0.5 + 58 + right_offset, 48, 42, 21, 4, 4, 4, 4);
			break;
		case 1:
			noFill();
			stroke(255);
			strokeWeight(2);
			rect(width * 0.5 + 108 + right_offset, 48, 39, 21, 4, 4, 4, 4);
			break;
		case 2:
			noFill();
			stroke(255);
			strokeWeight(2);
			rect(width * 0.5 + 153 + right_offset, 48, 41, 21, 4, 4, 4, 4);
			break;
	}
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
function toggle_ld_edit(){
	if((seq[0].editor.last_ed_change + 1000) < millis()){
		seq[1].editor.ed_mode = false;
		if(!seq[0].editor.ed_mode) 
			seq[0].editor.ed_mode = true;
		else
			seq[0].editor.ed_mode = false;
		seq[0].editor.toggleCtrls();
		seq[1].editor.toggleCtrls();
		seq[0].editor.last_ed_change = millis();	
	}
	if(!seq[0].editor.ed_mode && !seq[1].editor.ed_mode){
		melody_bass._events.touchstart()
		seq[1].editor.ed_mode = false;
	}	
}

//===========================================
function toggle_bs_edit(){
	if((seq[1].editor.last_ed_change + 1000) < millis()){
		seq[0].editor.ed_mode = false;
		if(!seq[1].editor.ed_mode)
			seq[1].editor.ed_mode = true;
		else
			seq[1].editor.ed_mode = false;
		seq[0].editor.toggleCtrls();
		seq[1].editor.toggleCtrls();
		seq[1].editor.last_ed_change = millis();	
	} 
	if(!seq[0].editor.ed_mode && !seq[1].editor.ed_mode){
		melody_lead._events.touchstart()
		seq[0].editor.ed_mode = false;
	}	
}

//===========================================
function apply_global(){

	// Clear all editor buttons
	for(var i = 0; i < seq[0].editor.steps; i++){
		for(var j = 0; j < seq[0].editor.melody.scl_deg; j++){
			seq[0].editor.melody.mel_steps[i].buttons[j].on = false;
			seq[0].editor.melody.mel_steps[i].buttons[j].t_counter = 0;
			seq[0].editor.melody.mel_steps[i].buttons[j].active_index = 7;
			seq[1].editor.melody.mel_steps[i].buttons[j].on = false;
			seq[1].editor.melody.mel_steps[i].buttons[j].t_counter = 0;
			seq[1].editor.melody.mel_steps[i].buttons[j].active_index = 7;			
		}
	}

	if (global_opt.value() == 'Rand All'){				// Randomize all sequencer buttons
		for(var i = 0; i < seq.length; i++){
			for(var j = 0; j < seq[i].buttons.length; j++){
				var state = boolean(int(random(2)));
				seq[i].buttons[j].on = state;
				seq[i].idle_buttons[j].on = state;

				if(state == true) seq[i].buttons[j].t_counter = 1;
				else seq[i].buttons[j].t_counter = 0;
				
				if(i < 2) {
					seq[i].editor.melody.mel_steps[j].active_index = int(random(7));
					var idx = seq[i].editor.melody.mel_steps[j].active_index;
					seq[i].editor.melody.mel_steps[j].buttons[idx].on = state;

					if(state == true) seq[i].editor.melody.mel_steps[j].buttons[idx].t_counter = 1;
					else seq[i].editor.melody.mel_steps[j].buttons[idx].t_counter = 0;
				}
			}

			if(i < 2){
				var rnd_root = random(0, seq[i].editor.notes.length);
				seq[i].editor.root_opt.value(int(rnd_root));
				var rnd_scl = random(0, seq[i].editor.scales.length);
				seq[i].editor.scale_opt.value(seq[i].editor.scales[int(rnd_scl)]);
				seq[i].editor.check_scale();
			}
			
		}
	
		update_all_notes();

	} else if (global_opt.value() == 'Clear All'){		// Clear all sequencers
		
		// Remove option boxes to avoid editor bugs
		seq[0].editor.root_opt.remove();
		seq[0].editor.scale_opt.remove();
		seq[1].editor.root_opt.remove();
		seq[1].editor.scale_opt.remove();

		for(var i = 0; i < seq.length; i++){
			if(i == 0){
				seq[i] = new Ld_Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
			} else if (i == 1) {
				seq[i] = new Bs_Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
			} else
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
// Update master volume
function update_vol(){
	// Set exponential slider function
	masterVolume(pow(vol_slider.value()/100.0, 2));
}

//===========================================
// Update sequencer tempo
function update_tempo(){
	quarter = 60000.0/tempo_slider.value();

	if((millis() - time0) >= quarter*pow(2.0, 2 - div_slider.value())) {
		new_beat = true;
		time0 = millis();
	} else new_beat = false;
}

//===========================================
// Check step slider value
function update_steps(){

	// Array to store button states
	var temp_states = new Array(last_steps);
	var idx = [];
	var roots = [];
	var scales = [];

	// Check for step slider status on previous frame
	// If it has changed, store states, resize arrays and update states
	if(steps_slider.value() != last_steps){

		roots.push(seq[0].editor.root_opt.value());
		roots.push(seq[1].editor.root_opt.value());
		scales.push(seq[0].editor.scale_opt.value());
		scales.push(seq[1].editor.scale_opt.value());

		// Remove option boxes to avoid editor bugs
		seq[0].editor.root_opt.remove();
		seq[0].editor.scale_opt.remove();
		seq[1].editor.root_opt.remove();
		seq[1].editor.scale_opt.remove();

		// Store previous states and indexes
		for(var i = 0; i < seq.length; i++){

			var idx_ins = [];

			for(var j = 0; j < seq[i].buttons.length; j++){
				if(seq[i].buttons[j].on) 
					temp_states[j] = true;
				else temp_states[j] = false;

				if(i < 2)
					idx_ins.push(seq[i].editor.melody.mel_steps[j].active_index);
			}

			if(i < 2)
				idx.push(idx_ins);

			// Reinitialize arrays
			if(i == 0){
				seq[i] = new Ld_Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
			} else if (i == 1) {
				seq[i] = new Bs_Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
			} else
				seq[i] = new Button_Set(steps_slider.value(), slider_area + ((i + 1) * (height - slider_area)/(num_ins + 1)), button_radius, button_colors[i]);
			
			seq[i].index = i;

			// Recall previous states and indexes
			for(var j = 0; j < min(seq[i].buttons.length, temp_states.length); j++){
				if(temp_states[j]){
					seq[i].buttons[j].on = true;
					seq[i].idle_buttons[j].on = true;

					if(i < 2){
						seq[i].editor.melody.mel_steps[j].buttons[idx[i][j]].on = true;
						seq[i].editor.melody.mel_steps[j].buttons[idx[i][j]].t_counter = 1;
					}

				} else {
					seq[i].buttons[j].on = false;
					seq[i].idle_buttons[j].on = false;

					if(i < 2){
						seq[i].editor.melody.mel_steps[j].buttons[idx[i][j]].on = false;
						seq[i].editor.melody.mel_steps[j].buttons[idx[i][j]].t_counter = 0;
					}
				}

				if(i < 2)
					seq[i].editor.melody.mel_steps[j].active_index = idx[i][j];
			}
		}

		for(var i = 0; i < 2; i++){
			seq[i].editor.root_opt.value(roots[i]);
			seq[i].editor.scale_opt.value(scales[i]);
		}

		update_all_notes();

		// Store new number of steps
		last_steps = steps_slider.value();
	}
}

//===========================================
// Update all melody button set notes
function update_all_notes(){
	for(var i = 0; i < 2; i ++){
		for(var j = 0; j < seq[i].buttons.length; j++){
			seq[i].editor.melody.mel_steps[j].update_note();
		}
	}
}

//===========================================
// Read function: Update global tempo counter
// and run play function on every new beat
function read(){
	if(steps_slider.value() == last_steps){
		if(play_state){
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
}

//===========================================
// Play function: Trigger notes
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
	play_button.toggle();
	rew_button.toggle();

	if(seq[0].editor.ed_mode) {
		seq[0].editor.close.toggle();
		seq[0].editor.toggle();
	} else if (seq[1].editor.ed_mode) {
		seq[1].editor.close.toggle();
		seq[1].editor.toggle();
	} else {
		for(var i = 0; i < seq.length; i++){
			seq[i].toggle();
		}	
	}
}

//===========================================
function touchEnded(){
	play_button.toggleTouch();
	rew_button.toggleTouch();

	if(seq[0].editor.ed_mode) {
		seq[0].editor.close.toggleTouch();
		seq[0].editor.toggleTouch();
	} else if(seq[1].editor.ed_mode) {
		seq[1].editor.close.toggleTouch();
		seq[1].editor.toggleTouch();
	} else {
		for(var i = 0; i < seq.length; i++){
			seq[i].toggleTouch();
			seq[i].checkpTouch();
		}
	}
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

	this.toggleTouch = function(){
		if(select_global == this.index){
			for(var i = 0; i < num_; i++){
				this.buttons[i].toggleTouch();
				this.idle_buttons[i].toggleTouch();
			}
		}
	}

	this.checkpTouch = function(){
		if((ptouchX > sidebar + this.x_box) && (ptouchX < this.x_box + this.w_box) && (ptouchY > (this.y_box - this.hover_offset)) && (ptouchY < (this.y_box + this.h_box + this.hover_offset))) {
			select_global = this.index;
		}
	}
}

//===========================================
// Lead Button Set: Extends Button_Set class
// Arguments: number of buttons, y_pos, radius, color
Ld_Button_Set = function(num_, y_, r_, color_){
	Button_Set.call(this, num_, y_, r_, color_);
	this.editor = new LdEditor(sidebar, slider_area, width - sidebar, height - slider_area, color_);
	this.editor.parent = this;

	this.update = function(){
		this.checkHover();
	}

	this.run_editor = function(){
		this.editor.run();
	}

}

//===========================================
// Bass Button Set: Extends Button_Set class
// Arguments: number of buttons, y_pos, radius, color
function Bs_Button_Set(num_, y_, r_, color_){
	Button_Set.call(this, num_, y_, r_, color_);
	this.editor = new BsEditor(sidebar, slider_area, width - sidebar, height - slider_area, color_);
	this.editor.parent = this;

	this.update = function(){
		this.checkHover();
	}

	this.run_editor = function(){
		this.editor.run();
	}
}

//===========================================
// Melody Button Set class
// Arguments: number of buttons, x_pos, y_pos, set_width, set_height, color
function Melody_Set(num_, x_, y_, w_, h_, color_){
	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;
	this.scl_deg = 8;
	this.color = color_;
	this.mel_steps = new Array(num_);
	this.parent;
	this.index;

	for(var i = 0; i < num_; i++){
		this.mel_steps[i] = new MelStep(this.scl_deg, this.x + this.w/(num_+1)*(i+1), this.y, 18, this.h - 30, this.color);
		this.mel_steps[i].index = i;
		this.mel_steps[i].parent = this;
	}

	this.update = function(){
	}

	this.display = function(){
	}

	this.run = function(){
		this.update();
		this.display();
		for(var i = 0; i < num_; i++){
			this.mel_steps[i].run();
		}
	}

	this.toggle = function(){
		for(var i = 0; i < num_; i++){
			this.mel_steps[i].toggle();
		}
	}

	this.toggleTouch = function(){
		for(var i = 0; i < num_; i++){
			this.mel_steps[i].toggleTouch();
		}
	}

	this.get_scale_notes = function(scale){
		var sum = 0;
		for(var i = 0; i < this.scl_deg; i++){
			text(this.parent.notes[(((this.parent.notes.length + this.parent.root_opt.value()) - (sum % (this.parent.notes.length)))) % (this.parent.notes.length)], this.x + this.w/(num_+1) - 12, this.y + i*(this.h - 30)/this.scl_deg);
 			sum += scale[scale.length - 1 - i]
 		}
	}

	this.scale_labels = function(){
		noStroke();
		fill(255);
		textAlign(RIGHT, TOP);
		textSize(16);
		
		this.get_scale_notes(this.parent.current_scale);
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
	this.mode = 1;
	this.index;
	this.parent;

	this.update = function(){
		this.checkHover();
		this.checkPress();
	};

	this.display = function(){
		strokeWeight(1);
		stroke(0);
		if(beat == this.index) fill(255, 0, 0);
		else fill(255);
		ellipse(this.x, this.y, this.r * 2.5, this.r * 2.5);

		if(this.mode == 1 && this.on){
			fill(this.c);
		} else fill(255);
		ellipse(this.x, this.y, this.r * 2.0, this.r * 2.0);
		if(this.pressed) {
			fill(100, 150);
			ellipse(this.x, this.y, this.r * 2.0, this.r * 2.0);
		} else if(this.hover) {
			fill(200, 150);
			ellipse(this.x, this.y, this.r * 2.0, this.r * 2.0);
		}
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
			
			if(this.parent.editor) {
				var idx = this.parent.editor.melody.mel_steps[this.index].active_index;
				this.parent.editor.melody.mel_steps[this.index].buttons[idx].t_counter = this.t_counter;
				this.parent.editor.melody.mel_steps[this.index].buttons[idx].on = this.on;
			}
		}
	}

	this.toggleTouch = function(){
		var touchDist = dist(this.x, this.y, ptouchX, ptouchY);
		if(touchDist < this.r){
			this.t_counter++;
			this.on = boolean(this.t_counter % 2);

			if(this.parent.editor) {
				var idx = this.parent.editor.melody.mel_steps[this.index].active_index;
				this.parent.editor.melody.mel_steps[this.index].buttons[idx].t_counter = this.t_counter;
				this.parent.editor.melody.mel_steps[this.index].buttons[idx].on = this.on;
			}
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
		strokeWeight(1);
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

	this.toggleTouch = function(){
		var touchDist = dist(this.parent.buttons[this.index].x, this.parent.buttons[this.index].y, ptouchX, ptouchY);
		if(touchDist < this.r){
			this.t_counter++;
			this.on = boolean(this.t_counter % 2);
		}
	}
}

//===========================================
// Play/Stop Button class
// Arguments: x_pos, y_pos, width, height
function Play(x_, y_, w_, h_){
	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;
	this.p_counter = 0;
	this.hover = false;
	this.pressed = false;
	this.on = false;

	this.update = function() {
		this.checkHover();
		this.checkPress();
		this.checkPlay();
	}

	this.display = function() {
		if(this.on) {
			fill(0, 255, 0);
			rect(this.x, this.y, this.w, this.h, 2);
			if(this.pressed) {
				fill(100, 150);
				rect(this.x, this.y, this.w, this.h, 2);
			} else if(this.hover) {
				fill(200, 150);
				rect(this.x, this.y, this.w, this.h, 2);
			}
			noStroke();
			fill(255);
			triangle(this.x + 7.5, this.y + 5, this.x + 7.5, this.y + this.h - 5, this.x + this.w - 5 , this.y + (this.h * 0.5));
		} else {
			fill(255);
			rect(this.x, this.y, this.w, this.h, 2);
			if(this.pressed) {
				fill(100, 150);
				rect(this.x, this.y, this.w, this.h, 2);
			} else if(this.hover) {
				fill(200, 150);
				rect(this.x, this.y, this.w, this.h, 2);
			}
			noStroke();
			fill(0);
			triangle(this.x + 7.5, this.y + 5, this.x + 7.5, this.y + this.h - 5, this.x + this.w - 5 , this.y + (this.h * 0.5));
		}
		

	}

	this.run = function(){
		this.update();
		this.display();
	}

	this.checkPlay = function(){
		if(this.on) play_state = true;
		else play_state = false;
	}

	this.checkHover = function(){
		if((mouseX > this.x) && (mouseX < this.x + this.w) && (mouseY > this.y) && (mouseY < this.y + this.h)) {
			this.hover = true;
		} else {
			this.hover = false;
		}
	}

	this.checkPress = function(){
		if(this.hover){
			if(mouseIsPressed) this.pressed = true;
			else this.pressed = false;
		}
		else this.pressed = false;
	}

	this.toggle = function(){
		if(this.hover){
			this.p_counter++;
			this.on = boolean(this.p_counter % 2);
		}
	}

	this.toggleTouch = function() {
		if((ptouchX > this.x) && (ptouchX < this.x + this.w) && (ptouchY > this.y) && (ptouchY < this.y + this.h)) {
			this.p_counter++;
			this.on = boolean(this.p_counter % 2);
		}
	}
}

//===========================================
// Rew Button class
// Arguments: x_pos, y_pos, width, height
function Rew(x_, y_, w_, h_){
	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;
	this.hover = false;
	this.pressed = false;

	this.update = function() {
		this.checkHover();
		this.checkPress();
	}

	this.display = function() {
		fill(255);
		rect(this.x, this.y, this.w, this.h, 2);
		if(this.pressed) {
			fill(100, 150);
			rect(this.x, this.y, this.w, this.h, 2);
		} else if(this.hover) {
			fill(200, 150);
			rect(this.x, this.y, this.w, this.h, 2);
		}
		noStroke();
		fill(0);
		rect(this.x + 7.5, this.y + 5, this.w/8.0, this.h - 10);
		triangle(this.x + this.w - 7.5, this.y + 5, this.x + this.w * 0.5 - 5, this.y + this.h * 0.5, this.x + this.w - 7.5, this.y + this.h - 5);
	}

	this.run = function() {
		this.update();
		this.display();
	}

	this.checkHover = function(){
		if((mouseX > this.x) && (mouseX < this.x + this.w) && (mouseY > this.y) && (mouseY < this.y + this.h)) {
			this.hover = true;
		} else {
			this.hover = false;
		}
	}

	this.checkPress = function(){
		if(this.hover){
			if(mouseIsPressed) this.pressed = true;
			else this.pressed = false;
		}
		else this.pressed = false;
	}

	this.toggle = function(){
		if(this.hover){
			counter = 0;
			beat = 0;
		}
	}

	this.toggleTouch = function() {
		if((ptouchX > this.x) && (ptouchX < this.x + this.w) && (ptouchY > this.y) && (ptouchY < this.y + this.h)) {
			counter = 0;
			beat = 0;
		}
	}
}

//===========================================
// Editor class
// Arguments: pos_x, pos_y, width, height, color
function Editor(x_, y_, w_, h_, c_){
	this.offset = 50;
	this.x = x_ + this.offset;
	this.y = y_ + this.offset;
	this.w = w_ - this.offset - 20;
	this.h = h_ - this.offset - 20;
	this.c = c_;
	this.hover = false;
	this.ed_mode = false;
	this.steps = steps_slider.value();
	this.close = new CloseButton(this.x + this.w - 20, this.y + 10, 10, 10);
	this.close.parent = this;
	this.sidebar = 90;
	this.melody = new Melody_Set(this.steps, this.x + this.sidebar, this.y+30, this.w - this.sidebar, this.h-30, this.c);
	this.melody.parent = this;
	this.current_scale;
	this.last_ed_change = 0;
	this.parent;
	
	// Scale setup
	this.notes = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
	this.scales = ['Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian', 'Harm. Minor', 'Mel. Minor'];
	this.major = [2, 2, 1, 2, 2, 2, 1];
	this.minor = [2, 1, 2, 2, 1, 2, 2];
	this.dorian = [2, 1, 2, 2, 2, 1, 2];
	this.phrygian = [1, 2, 2, 2, 1, 2, 2];
	this.lydian = [2, 2, 2, 1, 2, 2, 1];
	this.mixolydian = [2, 2, 1, 2, 2, 1, 2];
	this.locrian = [1, 2, 2, 1, 2, 2, 2];
	this.harmonic = [2, 1, 2, 2, 1, 3, 1];
	this.melodic = [2, 1, 2, 2, 2, 2, 1];
	this.root_opt = createSelect();
	this.root_opt.position(this.x + 25, this.y + 50);
	this.root_opt.hide();
	this.scale_opt = createSelect();
	this.scale_opt.position(this.x + 25, this.y + 100);
	this.scale_opt.hide();
	this.current_scale = this.major; // initialize as major scale
	
	for(var i = 0; i < this.notes.length; i++)
		this.root_opt.option(this.notes[i], i);

	for(var i = 0; i < this.scales.length; i++){
		this.scale_opt.option(this.scales[i]);
	}

	this.update = function(){
		this.checkHover();
		this.check_scale();
	}

	this.display = function(){
		fill(225, 100);
		rect(this.x, this.y, this.w, this.h, 15);
		this.labels();
	}

	this.run = function() {
		this.update();
		this.display();
		this.melody.run();
		this.close.run();
	}

	this.checkHover = function(){
		if((mouseX > this.x) && (mouseX < this.x + this.w) && (mouseY > this.y) && (mouseY < this.y + this.h)) {
			this.hover = true;
		} else {
			this.hover = false;
		}
	}

	this.toggle = function(){
		this.melody.toggle();
	}

	this.toggleTouch = function(){
		this.melody.toggleTouch();
	}

	this.toggleCtrls = function(){
		if(this.ed_mode){
			this.root_opt.show();
			this.scale_opt.show();
		} else {
			this.root_opt.hide();
			this.scale_opt.hide();
		}
	}

	this.labels = function(){
		noStroke();
		fill(255);
		textAlign(LEFT, TOP);
		textSize(14);
		if(this.ed_mode) {
			text("Root:", this.x + 25, this.y + 30);
			text("Scale:", this.x + 25, this.y + 80);
			this.melody.scale_labels();
		}
		
	}

	this.check_scale = function(){
		switch(this.scale_opt.value()){
			case 'Major':
				this.current_scale = this.major;
		 		break;
		 	case 'Minor':
		 		this.current_scale = this.minor;
		 		break;
		 	case 'Dorian':
		 		this.current_scale = this.dorian;
	 			break;
 			case 'Phrygian':
 				this.current_scale = this.phrygian;
				break;
			case 'Lydian':
				this.current_scale = this.lydian;
				break;
			case 'Mixolydian':
				this.current_scale = this.mixolydian;
				break;
			case 'Locrian':
				this.current_scale = this.locrian;
				break;
			case 'Harm. Minor':
				this.current_scale = this.harmonic;
				break;
			case 'Mel. Minor':
				this.current_scale = this.melodic;
				break;
		}
	}
}

//===========================================
// LdEditor: extends Editor class
// Arguments: pos_x, pos_y, width, height, color
function LdEditor(x_, y_, w_, h_, c_){
	Editor.call(this, x_, y_, w_, h_, c_);

	for(var i = 0; i < this.steps; i++){
		this.melody.mel_steps[i].note_base = 60;
		this.melody.mel_steps[i].note = 60;
	}

	this.display = function(){
		fill(225, 50);
		rect(0, this.y + 14, sidebar + 50, 20);
		rect(this.x, this.y, this.w, this.h, 15);
		this.labels();
	}	
}

//===========================================
// BsEditor: extends Editor class
// Arguments: pos_x, pos_y, width, height, color
function BsEditor(x_, y_, w_, h_, c_){
	Editor.call(this, x_, y_, w_, h_, c_);

	for(var i = 0; i < this.steps; i++){
		this.melody.mel_steps[i].note_base = 24;
		this.melody.mel_steps[i].note = 24;
	}

	this.display = function(){
		fill(225, 50);
		rect(0, this.y + 89, sidebar + 50, 20);
		rect(this.x, this.y, this.w, this.h, 15);
		this.labels();
	}	
}

//===========================================
// SimpleButton base class
// Arguments: pos_x, pos_y, width, height
function SimpleButton(x_, y_, w_, h_){
	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;
	this.hover = false;
	this.pressed = false;
	this.mode = 0;			// Modes: 0 - momentary, 1 - latch, 2 - timer
	this.on = false;
	this.t_counter = 0;

	this.update = function() {
		this.checkHover();
		this.checkPress();
	}

	this.display = function(){
		fill(255);
		if(this.mode == 1 && this.on){
			fill(0, 255, 0);
		} else fill(255);
		rect(this.x, this.y, this.w, this.h);
		if(this.pressed) {
			fill(100, 150);
			rect(this.x, this.y, this.w, this.h);
		} else if(this.hover) {
			fill(200, 150);
			rect(this.x, this.y, this.w, this.h);
		}
	}

	this.run = function() {
		this.update();
		this.display();
	}

	this.checkHover = function(){
		if((mouseX > this.x) && (mouseX < this.x + this.w) && (mouseY > this.y) && (mouseY < this.y + this.h)) {
			this.hover = true;
		} else {
			this.hover = false;
		}
	}

	this.checkPress = function(){
		if(this.hover){
			if(mouseIsPressed) this.pressed = true;
			else this.pressed = false;
		}
		else this.pressed = false;
	}

	this.toggle = function(){
		if(this.hover){
			if(this.mode == 1){
				this.t_counter++;
				this.on = boolean(this.t_counter % 2);
			}
		}
	}

	this.toggleTouch = function() {
		if((ptouchX > this.x) && (ptouchX < this.x + this.w) && (ptouchY > this.y) && (ptouchY < this.y + this.h)) {
			if(this.mode == 1){
				this.on = boolean(this.t_counter++ % 2);
			}
		}
	}
}

//===========================================
// CloseButton: extends SimpleButton class
// Arguments: pos_x, pos_y, width, height
function CloseButton(x_, y_, w_, h_){
	SimpleButton.call(this, x_, y_, w_, h_);
	this.parent;

	this.display = function(){
		
		ellipseMode(CORNER);
		stroke(0);
		strokeWeight(1);
		fill(225, 25);
		ellipse(this.x-2, this.y-2, this.w+4, this.h+4);
		stroke(127, 0, 0);
		fill(255, 0, 0);
		ellipse(this.x, this.y, this.w, this.h);
		if(this.pressed) {
			fill(150, 0, 0, 150);
			ellipse(this.x, this.y, this.w, this.h);
		} else if(this.hover) {
			fill(200, 100, 0, 150);
			ellipse(this.x, this.y, this.w, this.h);
		}
	}

	this.toggle = function(){
		if(this.hover){
			this.parent.ed_mode = false;
			this.parent.toggleCtrls();
		}
	}

	this.toggleTouch = function(ed_switch) {
		if((ptouchX > this.x) && (ptouchX < this.x + this.w) && (ptouchY > this.y) && (ptouchY < this.y + this.h)) {
			this.parent.ed_mode = false;
			this.parent.toggleCtrls();
		}
	}
}

//===========================================
// MelButton: extends SimpleButton class
// Arguments: pos_x, pos_y, width, height
function MelButton(x_, y_, w_, h_, color_) {
	SimpleButton.call(this, x_, y_, w_, h_);
	this.mode = 1;
	this.color = color_;
	this.parent;
	this.index;

	this.display = function(){
		stroke(0);
		strokeWeight(1);
		if(beat == this.parent.index) fill(255, 0, 0);
		else fill(255);
		rect(this.x-3, this.y-3, this.w+6, this.h+6);
		if(this.mode == 1 && this.on){
			fill(this.color);
		} else fill(255);
		rect(this.x, this.y, this.w, this.h);
		if(this.pressed) {
			fill(100, 150);
			rect(this.x, this.y, this.w, this.h);
		} else if(this.hover) {
			fill(200, 150);
			rect(this.x, this.y, this.w, this.h);
		}
	}

	this.toggle = function(){
		if(this.hover){
			if(this.mode == 1){
				this.t_counter++;
				this.on = boolean(this.t_counter % 2);

				var parent_idx = this.parent.index;
				
				this.parent.parent.parent.parent.buttons[parent_idx].t_counter = this.t_counter;
				this.parent.parent.parent.parent.buttons[parent_idx].on = this.on;
				this.parent.parent.parent.parent.idle_buttons[parent_idx].on = this.on;
			}
		}
	}

	this.toggleTouch = function() {
		if((ptouchX > this.x) && (ptouchX < this.x + this.w) && (ptouchY > this.y) && (ptouchY < this.y + this.h)) {
			if(this.mode == 1){
				this.t_counter++;
				this.on = boolean(this.t_counter % 2);

				var parent_idx = this.parent.index;
				
				this.parent.parent.parent.parent.buttons[parent_idx].t_counter = this.t_counter;
				this.parent.parent.parent.parent.buttons[parent_idx].on = this.on;
				this.parent.parent.parent.parent.idle_buttons[parent_idx].on = this.on;
			}
		}
	}
}

//===========================================
// MelStep: Array of inter-dependent buttons
// Arguments: num_buttons, x_pos, y_pos, sys width, sys height, button color
function MelStep(num_, x_, y_, w_, h_, color_){
	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;
	this.hover = false;
	this.color = color_;
	this.buttons = new Array(num_);
	this.parent;
	this.index;
	this.active_index = 7;
	this.note_base;
	this.note;

	for(var i = 0; i < num_; i++){
		this.buttons[i] = new MelButton(this.x, this.y + i*this.h/num_, 18, 18, this.color);
		this.buttons[i].parent = this;
		this.buttons[i].index = i;
	}

	this.update = function(){
		this.checkHover();
		this.update_note();
	}

	this.display = function(){
		if(this.hover){
			noStroke();
			fill(255, 50);
			rect(this.x - 5, this.y - 5, this.w + 12, 12 + this.h - this.h/num_ + 18, 4);
		}
		fill(255);
		rect(this.x + 7, this.y, this.w - 12, 2 + this.h - this.h/num_ + 18, 4);
	}

	this.run = function(){
		this.update();
		this.display();
		for(var i = 0; i < num_; i++){
			this.buttons[i].run();
		}
	}

	this.get_note = function(){
		var sum = 0;
		for(var i = 0; i < ((num_ - 1 ) - this.active_index); i++){
			sum += this.parent.parent.current_scale[i];
		}
		return sum;
	}

	this.toggle = function(){
		for(var i = 0; i < num_; i++){
			// Clear other buttons
			if(this.hover){
				if(!this.buttons[i].hover){
					this.buttons[i].on = false;
					this.buttons[i].t_counter = 0;
				}
			}
		}

		// Toggle button
		for(var i = 0; i < num_; i++){
			this.buttons[i].toggle();
			if(this.buttons[i].hover){
				this.active_index = this.buttons[i].index;
			}
		}
	}

	this.update_note = function(){
		var button_note = this.get_note();
		this.note = this.note_base + int(this.parent.parent.root_opt.value()) + button_note;
	}

	this.toggleTouch = function(){
		for(var i = 0; i < num_; i++){
			// Clear other buttons
			if((ptouchX > this.x) && (ptouchX < this.x + this.w) && (ptouchY > this.y) && (ptouchY < this.y + this.h)) {
				if(!((ptouchX > this.buttons[i].x) && (ptouchX < this.buttons[i].x + this.buttons[i].w) && (ptouchY > this.buttons[i].y) && (ptouchY < this.buttons[i].y + this.buttons[i].h))) {
					this.buttons[i].on = false;
					this.buttons[i].t_counter = 0;
				}
			}
		}

		// Toggle button
		for(var i = 0; i < num_; i++){
			this.buttons[i].toggleTouch();
			if((ptouchX > this.buttons[i].x) && (ptouchX < this.buttons[i].x + this.buttons[i].w) && (ptouchY > this.buttons[i].y) && (ptouchY < this.buttons[i].y + this.buttons[i].h)) {
				this.active_index = this.buttons[i].index;
				console.log(this.active_index);
				var button_note = this.get_note(this.buttons[i].index);
				this.note = this.note_base + int(this.parent.parent.root_opt.value()) + button_note;
			}
		}
	}

	this.checkHover = function(){
		if((mouseX > this.x) && (mouseX < this.x + this.w) && (mouseY > this.y) && (mouseY < this.y + this.h)) {
			this.hover = true;
		} else {
			this.hover = false;
		}
	}

}

//===========================================
// Bass class
// Arguments:
function Bass(){
	this.osc = new p5.Oscillator('sawtooth');
	this.osc.amp(0);
	
	this.filt = new p5.LowPass();
	this.filt.set(400, 1);
	
	this.env = new p5.Env(0.01, 1, 1, 0.5);

	this.osc.disconnect();
	this.osc.connect(this.filt);

	this.osc.start();

	this.play = function(){
		this.note = seq[1].editor.melody.mel_steps[beat].note;
		this.osc.freq(midiToFreq(this.note));
		this.env.play(this.osc);
	}
}

//===========================================
// Lead class
// Arguments:
function Lead(){
	this.osc = new p5.Oscillator('sawtooth');
	this.osc.amp(0);
	
	this.filt = new p5.LowPass();
	this.filt.set(800, 20);
	
	this.env = new p5.Env(0.01, 1, 1, 0.5);

	this.osc.disconnect();
	this.osc.connect(this.filt);

	this.osc.start();

	this.play = function(){
		this.note = seq[0].editor.melody.mel_steps[beat].note;
		this.osc.freq(midiToFreq(this.note));
		this.env.play(this.osc);
	}
}



