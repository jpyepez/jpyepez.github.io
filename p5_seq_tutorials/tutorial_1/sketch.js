
// Global
var page;
var next_page;
var prev_page;
var last_page;
var title;
var box;
var box2;
var play_global;

// Sequencer elements
var seq;
var beat_seq;
var flex_seq;
var select_global;
var solid;

// Core drums
var core_kick;
var core_snare;
var core_hihat_c;
var core_hihat_o;
var core_tom;
var core_crash;
var kick_img;
var snare_img;
var hihat_c_img;
var hihat_o_img;
var tom_img;
var crash_img;

// Drums
var kick;
var snare;
var hihat_c;
var hihat_o;
var tom;
var crash;

// Rhythmic elements
var quarter;
var new_beat;
var counter;
var beat;
var time0;
var tempo_slider;
var steps_slider;
var div_slider;
var last_steps;

// GUI values
var sidebar;
var top_area;
var bot_area;

// Colors
var butter_blue;
var life_joke;

// Images
var volca;
var rhythm;

//===========================================
function preload(){
	// Load images
	kick_img = loadImage("../images/kick.png");
	snare_img = loadImage("../images/snare.png");
	hihat_c_img = loadImage("../images/hihat_c.png");
	hihat_o_img = loadImage("../images/hihat_o.png");
	tom_img = loadImage("../images/tom.png");
	crash_img = loadImage("../images/crash.png");
	volca = loadImage("../images/VolcaBeats.png");
	rhythm = loadImage("../images/rhythm.png");

	// Load sound files
	kick = loadSound('../audio/909_Kick.wav');
	kick.setVolume(.6);
	snare = loadSound('../audio/909_Snare.wav');
	snare.setVolume(.6);
	hihat_c = loadSound('../audio/909_HH_Closed.wav');
	hihat_c.setVolume(.6);
	hihat_o = loadSound('../audio/909_HH_Open.wav');
	hihat_o.setVolume(.6);
	tom = loadSound('../audio/909_Tom.wav');
	tom.setVolume(.6);
	crash = loadSound('../audio/909_Crash.wav');
	crash.setVolume(.6);
}

function setup() {

	createCanvas(800, 600);

	sidebar = 0;
	top_area = height*0.4;
	bot_area = height/8.0;

	counter = 0;
	time0 = 0;

	play_global = 0;

	butter_blue = color(0, 180, 255);
	life_joke = color(151, 0, 255);

	// Tempo slider
	tempo_slider = createSlider(60, 200, 100);
	tempo_slider.position(width * 0.5 - tempo_slider.width * 0.5, height * 0.33);
	tempo_slider.hide();

	// Steps slider
	steps_slider = createSlider(4, 16, 8);
	steps_slider.position(width * 0.33 - steps_slider.width * 0.5, height * 0.33);
	steps_slider.hide();

	// Resolution slider
	div_slider = createSlider(0, 5, 3);
	div_slider.position(width * 0.66 - steps_slider.width * 0.5, height * 0.33);
	div_durations = ["Whole", "1/2", "1/4", "1/8", "1/16", "1/32"];
	div_slider.hide();

	// Playback mode buttons
	play_fwd = createButton("Fwd", 0);
	play_fwd.position(width * 0.25 - play_fwd.width * 0.5, height * 0.275);
	play_fwd.mousePressed(set_play);
	play_fwd.hide();

	play_rev = createButton("Rev", 1);
	play_rev.position(width * 0.5 - play_rev.width * 0.5, height * 0.275);
	play_rev.mousePressed(set_play);
	play_rev.hide();

	play_rnd = createButton("Rnd", 2);
	play_rnd.position(width * 0.75 - play_rnd.width * 0.5, height * 0.275);
	play_rnd.mousePressed(set_play);
	play_rnd.hide();

	select_global = 0;

	page = 0;
	last_page = 16;
	next_page = new NextPage(width - 30, height - 50, life_joke);
	prev_page = new PrevPage(10, height - 50, life_joke);

	title = new TextBox(width * 0.5, height * 0.2, 28);
	box = new TextBox(width * 0.5, height * 0.3, 22);
	box2 = new TextBox(width * 0.5, height * 0.5, 22);

	// Sequencer button colors
	beat_seq_colors = [color(0, 100, 255), color(255, 127, 0), color(100, 0, 150)];

	init_seq();

	// Sequencer LED (solid) indicators (Slide 2)
	solid = new Solid_Set(8, height * 0.45);

	var core_width = 80;
	core_kick = new DrumPad(width/4.0 - core_width/2.0, height * 0.35, core_width, core_width, kick);
	core_snare = new DrumPad(width/2.0 - core_width/2.0, height * 0.35, core_width, core_width, snare);
	core_tom = new DrumPad(width*3/4.0 - core_width/2.0, height * 0.35, core_width, core_width, tom);
	core_hihat_c = new DrumPad(width/4.0 - core_width/2.0, height * 0.6, core_width, core_width, hihat_c);
	core_hihat_o = new DrumPad(width/2.0 - core_width/2.0, height * 0.6, core_width, core_width, hihat_o);
	core_crash = new DrumPad(width*3/4.0 - core_width/2.0, height * 0.6, core_width, core_width, crash);

	// Set master volume
	masterVolume(.8);
}

function draw() {
	background(0);

	page_manager();
	display_text();
	
	read_manager();
	tempo_manager();

	next_page.run();  
	prev_page.run();

	display_page()
}

//===========================================
// Print current page
function display_page() {
	textAlign(CENTER, CENTER);
	fill(butter_blue);
	textSize(16);
	text(page + "/" + last_page, width * 0.5, height - 20);
}

//===========================================
function mouseReleased(){
	seq.toggle();

	for(var i = 0; i < beat_seq.length; i++){
		beat_seq[i].toggle();
	}
	
	flex_seq.toggle();

	core_kick.toggle();
	core_snare.toggle();
	core_hihat_c.toggle();
	core_hihat_o.toggle();
	core_tom.toggle();
	core_crash.toggle();

	next_page.toggle();
	prev_page.toggle();
}

//===========================================
function page_manager(){
	
	// Constrain page index
	page = constrain(page, 0, last_page);

	// Display page content
	switch(page){
		case 0:
			title.set_position(width * 0.5, height * 0.25);
			title.set_color(life_joke);
			title.set_size(34);
			title.text = "Sequencers and Drum Machines";
			box.set_show(false);
			box2.set_show(false);
			imageMode(CENTER);
			image(volca, width*0.5, height*0.55, 750*.5, 450*.5);
			break;
		case 1:
			title.set_position(width * 0.5, height * 0.3);
			title.text = "Introduction"
			box.set_show(true);
			box.set_position(width * 0.5, height * 0.45);
			box.set_size(22);
			box.set_align(CENTER);
			box.set_color(255);
			box.text = "The P5 Sequencer, an online musical instrument,\n\nis freely available and playable in any web browser.\n\nAlong with this tutorial, it is meant to be a tool to understand,\n\nlearn, and create electronic and computer music.";
			box2.set_show(false);
			break;
		case 2:
			title.set_position(width * 0.5, height * 0.3);
			title.text = "What is a sequencer?";
			
			var slide_1 = "A sequencer is an electronic instrument.\n\nIt stores sequences of musical notes or sounds.\n\nIt is commonly used in pattern-based music.";
			box.set_show(true);
			box.set_position(width * 0.25, height * 0.45);
			box.set_align(LEFT);
			box.set_size(22);
			box.set_color(255);
			box.text = slide_1;
			box2.set_show(false);
			break;
		case 3:
			title.set_position(width * 0.5, height * 0.2);
			title.text = "How to Play a Sequencer"
			box.set_show(true);
			box.set_position(width * 0.1, height * 0.35);
			box.set_size(22);
			box.set_align(LEFT);
			box.set_color(255);
			box.text = "Sequencers cycle through a number of steps at a constant rate.";
			solid.run();
			var slide_2 = "Each step is usually a button that can be turned on or off.\n\nIf the step is on, the sequencer will play a note or a sound.\n\nTurning on steps will create patterns that can be played repeatedly.";
			box2.set_show(true);
			box2.set_position(width * 0.1, height * 0.625);
			box2.set_size(22);
			box2.set_align(LEFT);
			box2.text = slide_2;
			break;
		case 4:
			title.set_position(width * 0.5, height * 0.3);
			title.text = "Try It! Make a Rhythmic Pattern"
			box.set_show(true);
			box.set_position(width * 0.5, height * 0.7);
			box.set_size(20);
			box.set_align(CENTER);
			box.set_color(butter_blue);
			box.text = "Click on each button to add or remove notes.";
			box2.set_show(false);
			seq.run();
			break;
		case 5:
			title.set_position(width * 0.5, height * 0.3);
			title.text = "Drum Machines";
			box.set_show(true);
			box.set_position(width * 0.15, height * 0.45);
			box.set_size(22);
			box.set_align(LEFT);
			box.set_color(255);
			box.text = "Drum machines are sequencers built to play drum sounds.\n\nThey are usually a group of sequencers.\n\nThey can be used to program drum beats.";
			box2.set_show(false);
			break;
		case 6:
			title.set_position(width * 0.5, height * 0.18);
			title.text = "Core Drums and Cymbals";
			box.set_show(true);
			box.set_position(width * 0.1, height * 0.3);
			box.set_size(22);
			box.set_align(LEFT);
			box.set_color(butter_blue);
			box.text = "Click on each drum to listen to its sound:";
			box2.set_show(false);
			run_core_drums();
			break;
		case 7:
			title.set_position(width * 0.5, height * 0.2);
			title.text = "Try It! Make a Drum Beat";
			for(var i = 0; i < beat_seq.length; i++){
				beat_seq[i].run();
			}
			box.set_show(true);
			box.set_position(width * 0.5, height * 0.85);
			box.set_align(CENTER);
			box.set_size(20);
			box.set_color(butter_blue);
			box.text = "Click on each button to add or remove notes.";
			box2.set_show(false);
			break;
		case 8:
			title.set_position(width * 0.5, height * 0.3);
			title.text = "Tempo";
			box.set_show(true);
			box.set_position(width * 0.25, height * 0.45);
			box.set_size(22);
			box.set_align(LEFT);
			box.set_color(255);
			box.text = "Tempo is the \"speed\" of the music.\n\nIt is measured in \"beats per minute\" (BPM).\n\nThe higher the BPM, the faster the music.";
			box2.set_show(false);
			break;
		case 9:
			title.set_position(width * 0.5, height * 0.2);
			title.text = "Try It! Change the Tempo";
			box.set_show(true);
			box.set_position(width * 0.5, height * 0.7);
			box.set_align(CENTER);
			box.set_size(20);
			box.set_color(butter_blue);
			box.text = "Click on each button to add or remove notes.";
			box2.set_show(false);
			tempo_labels();
			tempo_slider.show();
			seq.run();
			break;
		case 10:
			title.set_position(width * 0.5, height * 0.3);
			title.text = "Steps";
			box.set_show(true);
			box.set_position(width * 0.15, height * 0.45);
			box.set_size(22);
			box.set_align(LEFT);
			box.set_color(255);
			box.text = "On sequencers, musical notes are organized in steps.\n\nEvery step has the same duration.\n\nYou can change the number of steps to create new patterns.";
			box2.set_show(false);
			break;
		case 11:
			title.set_position(width * 0.5, height * 0.2);
			title.text = "Rhythmic Figures (Time Divisions)";
			box.set_show(true);
			box.set_position(width * 0.15, height * 0.6);
			box.set_size(22);
			box.set_align(LEFT);
			box.set_color(255);
			box.text = "Step durations usually correspond to rhythmic figures.\n\nLonger rhythmic figures will \"slow down\" the music.\n\nChanging rhythmic figures can change the feel of the music.";
			box2.set_show(false);
			imageMode(CENTER);
			image(rhythm, width*0.5, height *0.4);
			break;
		case 12:
			title.set_position(width * 0.5, height * 0.15);
			title.text = "Try It! Change the Steps and Divisions";
			box.set_show(true);
			box.set_position(width * 0.5, height * 0.7);
			box.set_align(CENTER);
			box.set_size(20);
			box.set_color(butter_blue);
			box.text = "Click on each button to add or remove notes.";
			box2.set_show(false);
			steps_labels();
			steps_slider.show();
			div_labels();
			div_slider.show();
			update_steps();
			flex_seq.run();
			break;
		case 13:
			title.set_position(width * 0.5, height * 0.3);
			title.text = "Playing Modes";
			box.set_show(true);
			box.set_position(width * 0.225, height * 0.45);
			box.set_size(22);
			box.set_align(LEFT);
			box.set_color(255);
			box.text = "Sequencers usually offer different playing modes\n\nto change the order of the notes being played\n\nor to add some randomness to its patterns.";
			box2.set_show(false);
			break;
		case 14:
			title.set_position(width * 0.5, height * 0.15);
			title.text = "Try It! Playing Modes";
			box.set_show(true);
			box.set_position(width * 0.5, height * 0.85);
			box.set_align(CENTER);
			box.set_size(20);
			box.set_color(butter_blue);
			box.text = "Click on each button to add or remove notes.";
			box2.set_show(false);
			play_fwd.show();
			play_rev.show();
			play_rnd.show();
			pb_indicator();
			for(var i = 0; i < beat_seq.length; i++){
				beat_seq[i].run();
			}
			break;
		case 15:
			title.set_position(width * 0.5, height * 0.2);
			title.text = "Performance Tips"
			box.set_show(true);
			box.set_position(width * 0.1, height * 0.35);
			box.set_size(22);
			box.set_align(LEFT);
			box.set_color(255);
			box.text = "The P5 Sequencer offers many rhythmic tools; changing the tempo,\n\t\t\t\tsteps and divisions can create many interesting patterns.\n\nDon't forget to use the play/stop and rewind buttons, and the master \n\t\t\t\tvolume. Rest and dynamics are an important part of music.\n\nThe P5 Sequencer offers melodic editors to create leads and bass lines.\n\t\t\t\tAlthough they will be covered in other tutorials, there is no reason\n\t\t\t\t to not try them out.\n\nUse the playback modes and the global actions (using the apply button)\n\t\t\t\tto add randomness to your music.";
			box2.set_show(false);
			break;
		case 16:
			title.set_position(width * 0.5, height * 0.3);
			title.text = "Tutorial Complete";
			box.set_show(true);
			box.set_position(width * 0.5, height * 0.45);
			box.set_size(22);
			box.set_align(CENTER);
			box.set_color(255);
			box.text = "Good job! Now try to use what you have\n\nlearned in the P5 Sequencer.";
			box2.set_show(false);
			break;
		default:
			box.text = "How did you even get here???"
			box.set_show(false);
			box2.set_show(false);
			break;
	}
}

//===========================================
// Display all TextBox classes
function display_text(){
	title.run();
	box.run();
	box2.run();
}

//===========================================
// Tempo manager
function tempo_manager(){
	if(page > 8) full_update_tempo();
	else update_tempo();	
}

//===========================================
// Read/playhead manager
function read_manager(){
	if (page > 11) full_read();
	else read();
}

//===========================================
// Initialize/reset sequencers
function init_seq(){

	// Make Rhythms Sequencer
	seq = new Button_Set(8, height*0.5, 15, color(0, 255, 255));
  	seq.index = 0;

  	// Make a Beat Sequencers
  	beat_seq = new Array(3);
  	var beat_seq_area = height - top_area - bot_area;

	for(var i = 0; i < beat_seq.length; i++){
		beat_seq[i] = new Button_Set(8, top_area + i*beat_seq_area/3.0, 15, beat_seq_colors[i]);
		beat_seq[i].index = i;
	}

	flex_seq = new Button_Set(8, height*0.5, 15, color(0, 255, 255));
	flex_seq.index = 0;
}

//===========================================
// Reset tempo slider on page change
function reset_sliders(){
	tempo_slider.value(100);
	tempo_slider.hide();
	steps_slider.value(8);
	steps_slider.hide();
	last_steps = 8;
	div_slider.value(3);
	div_slider.hide();
}

//===========================================
// Reset playback mode on page change
function reset_playback(){
	play_fwd.hide();
	play_rev.hide();
	play_rnd.hide();
	play_fwd._events.mousedown();
}

//===========================================
// Update sequencer tempo from slider
function update_tempo(){
	quarter = 60000.0/100.0;

	if((millis() - time0) >= quarter*pow(2.0, 0)) {
		new_beat = true;
		time0 = millis();
	} else new_beat = false;
}

//===========================================
// Update sequencer tempo
function full_update_tempo(){
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

	// Check for step slider status on previous frame
	// If it has changed, store states, resize arrays and update states
	if(steps_slider.value() != last_steps){

		// Store previous states and indexes
		for(var i = 0; i < flex_seq.buttons.length; i++){
			if(flex_seq.buttons[i].on) 
				temp_states[i] = true;
			else temp_states[i] = false;
		}

		// Reinitialize sequencer
		flex_seq = new Button_Set(steps_slider.value(), height*0.5, 15, color(0, 255, 255));			
		flex_seq.index = 0;

		// Recall previous states and indexes
		for(var i = 0; i < min(flex_seq.buttons.length, temp_states.length); i++){
			if(temp_states[i]){
				flex_seq.buttons[i].on = true;
				flex_seq.idle_buttons[i].on = true;
			} else {
				flex_seq.buttons[i].on = false;
				flex_seq.idle_buttons[i].on = false;
			}
		}

		// Store new number of steps
		last_steps = steps_slider.value();
	}
}

//===========================================
function set_play(){
	play_global = this.value();
}

//===========================================
// Tempo labels
function tempo_labels(){
	textAlign(CENTER, TOP);
	textSize(14);
	fill(255);
	text(tempo_slider.value() + " BPM", tempo_slider.x + tempo_slider.width*0.5, tempo_slider.y + 30);
}	

//===========================================
// Steps labels
function steps_labels(){
	textAlign(CENTER, TOP);
	textSize(16);
	fill(255);
	text("Steps: ", steps_slider.x + steps_slider.width*0.3, steps_slider.y - 30);
	text(steps_slider.value(), steps_slider.x + steps_slider.width*0.75, steps_slider.y - 30);
}

//===========================================
// Resolution/division labels
function div_labels(){
	textAlign(CENTER, TOP);
	textSize(16);
	fill(255);
	text("Time Div:", div_slider.x + div_slider.width*0.3, div_slider.y - 30);
	text(div_durations[div_slider.value()], div_slider.x + div_slider.width*0.8, div_slider.y - 30);
}

//===========================================
// Playback mode indicator
function pb_indicator(){
	
	stroke(0);
	fill(255);
	strokeWeight(1);
	textAlign(CENTER);
	textSize(15);
	
	switch(int(play_global)) {
		case 0:
			text("Playback Mode: Forward", width * 0.5, height * 0.225);
			strokeWeight(4);
			noFill();
			stroke(255);
			rect(play_fwd.x, play_fwd.y, play_fwd.width, play_fwd.height, 4, 4, 4, 4);
			break;
		case 1:
			text("Playback Mode: Reverse", width * 0.5, height * 0.225);
			strokeWeight(4);
			noFill();
			stroke(255);
			rect(play_rev.x, play_rev.y, play_rev.width, play_rev.height, 4, 4, 4, 4);
			break;
		case 2:
			text("Playback Mode: Random", width * 0.5, height * 0.225);
			strokeWeight(4);
			noFill();
			stroke(255);
			rect(play_rnd.x, play_rnd.y, play_rnd.width, play_rnd.height, 4, 4, 4, 4);
			break;
	}
}

//===========================================
// Read function: Update global tempo counter
// and run play function on every new beat
function read(){
	if(new_beat){
		if(counter >= 8)
			counter = 0;
		if(counter < 0)
			counter = 8;

		beat = counter;
		play();
		
		counter ++;
	}
}

//===========================================
// Run core drum buttons
function run_core_drums() {
	stroke(255);
	strokeWeight(1);

	core_kick.run();
	image(kick_img, core_kick.x, core_kick.y, core_kick.w, core_kick.h);
	textSize(16);
	text("Kick Drum (KD)", core_kick.x - 10, core_kick.y + core_kick.h + 20);
	
	core_snare.run();
	image(snare_img, core_snare.x, core_snare.y, core_snare.w, core_snare.h);
	textSize(16);
	text("Snare Drum (SD)", core_snare.x - 10, core_snare.y + core_snare.h + 20);

	core_hihat_c.run();
	image(hihat_c_img, core_hihat_c.x, core_hihat_c.y, core_hihat_c.w, core_hihat_c.h);
	textSize(16);
	text("Closed Hi-Hat (HH)", core_hihat_c.x - 10, core_hihat_c.y + core_hihat_c.h + 20);

	core_hihat_o.run();
	image(hihat_o_img, core_hihat_o.x, core_hihat_o.y, core_hihat_o.w, core_hihat_o.h);	
	textSize(16);
	text("Open Hi-Hat (OH)", core_hihat_o.x - 10, core_hihat_o.y + core_hihat_o.h + 20);

	core_tom.run();
	image(tom_img, core_tom.x, core_tom.y, core_tom.w, core_tom.h);
	textSize(16);
	text("Toms", core_tom.x + 18, core_tom.y + core_tom.h + 20);
	
	core_crash.run();
	image(crash_img, core_crash.x, core_crash.y, core_crash.w, core_crash.h);
	textSize(16);
	text("Crash Cymbal", core_crash.x - 10, core_crash.y + core_crash.h + 20);
}

//===========================================
// Revamped Read function:
// Supports other steps, divs and modes
function full_read(){
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
// Play function: Trigger notes
function play(){
	if(page > 11 && page < 14) {
		if(flex_seq.buttons[beat].on) hihat_c.play();
	} else {
		if(seq.buttons[beat].on) hihat_c.play();

		if(beat_seq[0].buttons[beat].on) hihat_c.play();
		if(beat_seq[1].buttons[beat].on) snare.play();
		if(beat_seq[2].buttons[beat].on) kick.play();	
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
		} else {
			fill(127, 50);
		}
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
			if(beat == this.index) fill(255, 0, 0);
			else fill(255);
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
// NextPage class, extends SimpleButton
// Arguments: x_pos, y_pos (top vertex)
function NextPage(x_, y_, c_){
	SimpleButton.call(this, x_, y_, 20, 40);

	this.display = function(){
		noStroke();
		fill(c_);
		triangle(x_, y_, x_, y_ + 40, x_ + 20, y_ + 20);
		if(this.pressed) {
			fill(100, 150);
			triangle(x_, y_, x_, y_ + 40, x_ + 20, y_ + 20);
		} else if(this.hover) {
			fill(200, 150);
			triangle(x_, y_, x_, y_ + 40, x_ + 20, y_ + 20);
		}
	}

	this.toggle = function(){
		if(this.hover){
			if(this.mode == 1){
				this.t_counter++;
				this.on = boolean(this.t_counter % 2);
			} else if (this.mode == 0){
				page++;
			}
			init_seq();
			reset_sliders();
			reset_playback();
			beat = 0;
			counter = 0;
		}
	}
}

//===========================================
// PrevPage class, extends SimpleButton
// Arguments: x_pos, y_pos (top vertex)
function PrevPage(x_, y_, c_){
	SimpleButton.call(this, x_, y_, 20, 40);

	this.display = function(){
		noStroke();
		fill(c_);
		triangle(x_ + 20, y_, x_ + 20, y_ + 40, x_, y_ + 20);
		if(this.pressed) {
			fill(100, 150);
			triangle(x_ + 20, y_, x_ + 20, y_ + 40, x_, y_ + 20);
		} else if(this.hover) {
			fill(200, 150);
			triangle(x_ + 20, y_, x_ + 20, y_ + 40, x_, y_ + 20);
		}
	}

	this.toggle = function(){
		if(this.hover){
			if(this.mode == 1){
				this.t_counter++;
				this.on = boolean(this.t_counter % 2);
			} else if (this.mode == 0){
				page--;
			}
			init_seq();
			reset_sliders();
			reset_playback();
			beat = 0;
			counter = 0;
		}
	}
}

//===========================================
// TextBox class
// Arguments: x_pos, y_pos, text_size
function TextBox(x, y, size){
	this.text;
	this._x = x;
	this._y = y;
	this._size = size;
	this._show = true;
	this._align = CENTER;
	this._color = color(255);

	this.update = function(){
	}

	this.display = function(){
		if(this._show){
			textAlign(this._align);
			noStroke();
			fill(this._color);
			textSize(this._size);
			text(this.text, this._x, this._y);	
		}
	}

	this.run = function(){
		this.update();
		this.display();
	}

	this.set_position = function(x, y){
		this._x = x;
		this._y = y;
	}

	this.set_x = function(value){
		this._x = value;
	}

	this.set_size = function(size){
		this._size = size;
	}

	this.set_show = function(state){
		this._show = state;
	}

	this.set_align = function(alignment){
		this._align = alignment;
	}

	this.set_color = function(new_color) {
		this._color = new_color;
	}
}
	
//===========================================
// SolidRect
// Arguments: x_pos, y_pos
function SolidRect(x, y) {
	this._x = x;
	this._y = y;
	this.index;

	this.update = function() {

	}

	this.display = function() {
		strokeWeight(1);
		stroke(0);
		if(beat == this.index) {
			fill(255, 0, 0);
			stroke(255);
		} else {
			fill(255);
			stroke(0);
		}
		rect(this._x, this._y, 30, 30);
	}

	this.run = function() {
		this.update();
		this.display();
	}
}

//===========================================
// Solid_Set
// Arguments: num rectangles, y_pos
function Solid_Set(num, y){
	this.rects = new Array(num);
	this._y = y;

	for(var i = 0; i < num; i++){
		this.rects[i] = new SolidRect(width/(1 + this.rects.length + 1)*(i+1) + 10, this._y);
		this.rects[i].index = i;
		this.rects[i].parent = this;
	}

	this.update = function() {

	}

	this.display = function() {

	}

	this.run = function() {
		for(var i = 0; i < num; i ++)
			this.rects[i].run();
	}

}

//===========================================
// DrumPad
// Arguments: pos_x, pos_y, width, height, drum
function DrumPad(x, y, w, h, drum) {
	SimpleButton.call(this, x, y, w, h);

	this.toggle = function() {
		if(this.hover) drum.play();
	}
}



