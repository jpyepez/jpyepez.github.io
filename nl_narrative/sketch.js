// Introduction to Programming for the Visual Arts
// Synthesis A, Nonlinear Narrative
// "The Bat, Birds and the Beasts"
// JP Yepez
// 07/22/2016
/////////////

var page_idx;
var story;

// storyline booleans
var to_birds;
var talked_to_birdsA;
var talked_to_birdsB;
var talked_to_beastsA;
var talked_to_beastsB;
var conflict_resolved;
var clickIt;
var show_alert;

// images
var filenames = ["title_jungle_bw.png", "bat.png", "animals_bw.png", "birds.jpg", "beasts_bw.png", "jungle.jpeg", "raven_bw.png", "tiger_bw.png"];
var fade, max_fade;
var prev;

// palette
// http://www.colourlovers.com/palette/4305683/Babie_lato
var palette;

// text and fonts
var text_layer;
var box_width;
var box_height;
var input;
var cursorIsVisible;
var shiftIsDown;

// storyline strings
var main_title = "The Bat, Birds and the Beasts";
var subtitle = "Adaptation from Aesop's Fables";
var intro = "A great conflict was about to come off between the Birds and the Beasts.";
var dir = "Click or press ENTER to advance.\nType in a simple answer where given a choice.";
var bat = "You are the Bat. You have not joined either faction, and you do not want to be caught on the losing side.";
var question_1 = "You see the two armies collected together, and you have a choice to make.\nWho would you like to talk to, the birds or the beasts?";
var question_birds = "The birds said: \"Come with us\".\nAre you a bird?";
var birdsA = "You help the birds win the war, but you fall in battle. Everyone will remember you as a brave and cunning hero.";
var birdsB = "The birds ignore you.";
var question_beasts = "The beasts looked up and said: \"Come with us\".\nAre you on our side?";
var beastsA = "Your actions as a spy help the beasts conquer the bird army, but you are ambushed and taken prisoner before the end of the conflict.\nYou find comfort in the honor of your actions as you slowly realize you might never get back home again.";
var beastsB = "The beasts scoff at you as they walk away."
var peace = "At the last moment, peace was made, no battle took place, and everyone rejoiced.\nThe conflict was resolved."
var celebrate = "Peaceful times are coming, and you are eager to join the celebrations. Would you like to go with the birds or the beasts?";
var birdsC = "The birds said: \"You are no bird!\"\nThen, they turned their backs on you and flew away.";
var birdsD = "The birds are nowhere to be found.";
var beastsC = "The beasts growled: \"You are not a beast!\". You realize it is not safe to stay.";
var beastsD = "The beasts stare at you menacingly and you are forced to run away.";
var finale = "Living in constant fear of the birds and the beasts, you realize that you have no choice but to hide in the darkness and to only fly at night from now on.";
var moral = "\"He that is neither one thing nor the other has no friends.\"";

var alert1 = "The birds and the beasts are waiting.";
var alert2 = "They ask again, \"Well... Are you?\"";
var alert3 = "The beasts grow impatient.\nTime is running out.";
var alert4 = "The birds and the beasts stare at you.\nThey have noticed your hesitation.";

var end_alert = "You have reached the end of this storyline.\nPlease type \"start over\" to go back to the beginning.";

// sounds
var j_sounds;

function preload() {
	story = new Array(filenames.length);

	for(var i = 0; i < story.length; i++){
		story[i] = loadImage("assets/" + filenames[i]);
		story[i].resize(width, height);
	}

	j_sounds = loadSound("assets/jungle_sounds.mp3");
}

function setup() {
	pixelDensity(1);
	createCanvas(1024, 768);
	background(0);

	palette = [color(117,133,118, 50), color(100,115,101, 65), color(189,205,196), color(239,241,244), color(195,215,217), color(165,211,212)];

	page_idx = 0;
	clickIt = true;

	text_layer = createGraphics(width, height);
	text_layer.textFont("Montserrat");
	box_width = width * 0.5;
	box_height = 30;
	input = "";

	// storyline booleans
	talked_to_birdsA = false;
	talked_to_beastsA = false;
	talked_to_birdsB = false;
	talked_to_beastsB = false;

	show_alert = false;

	j_sounds.stop();
	j_sounds.setVolume(0.5);
	j_sounds.loop();
	j_sounds.play();

	max_fade = 15;
	fade = max_fade;

	// dummy stroke calls
	stroke(0);
	noStroke();
}

function draw() {

	page_mngr();

}

// Main page manager function
// Checks the value of page_idx every
// frame and draws the current scene.
function page_mngr(){
	
	text_layer.clear();

	switch(page_idx) {
		case 0:
			background(story[0]);
			tint_rect();
			title_box(main_title, height * 0.3);
			subtitle_box(subtitle, height * 0.4);
			intro_alert_box(dir, width * 0.25, height * 0.75, 20);
			clickIt = true;
			break;
		case 1:
			image(story[0], 0, 0, width, height);
			tint_rect();
			story_box(intro, width * 0.175, height * 0.4, text_layer.textSize() * 2.5);
			clickIt = true;
			break;
		case 2:
			fade_in(story[0], story[1]);
			tint_rect();
			story_box(bat, width * 0.175, height * 0.4, text_layer.textSize() * 4);
			clickIt = true;
			prev = story[1];
			break;
		case 3:
			fade_in(prev, story[2]);
			tint_rect();
			story_box(question_1, width * 0.1675, height * 0.25, text_layer.textSize() * 7.5);
			if(show_alert) 
				alert_box(alert1, width * 0.2, height * 0.6, text_layer.textSize());
			input_box();
			clickIt = false;
			break;
		case 4:
			if(to_birds){				// Talk to birds
				if(!talked_to_birdsA){
					story_box(question_birds, width * 0.25, height * 0.2, text_layer.textSize() * 3.5);
					if(show_alert) 
						alert_box(alert2, width * 0.225, height * 0.5, text_layer.textSize());
					input_box();
					clickIt = false;
				} else {
					story_box(birdsB, width * 0.32, height * 0.4, text_layer.textSize());
					clickIt = true;
				}
				fade_in(story[2], story[3]);
				tint_rect();
				prev = story[3];
			} else {					// Talk to beasts
				if(!talked_to_beastsA){
					story_box(question_beasts, width * 0.25, height * 0.2, text_layer.textSize() * 5.5);
					if(show_alert) 
						alert_box(alert3, width * 0.25, height * 0.5, text_layer.textSize() * 2.5);
					input_box();
				} else {
					story_box(beastsB, width * 0.3, height * 0.4, text_layer.textSize() * 2.5);
					clickIt = true;
				}	
				fade_in(story[2], story[4]);
				tint_rect();
				prev = story[4];
			}
			break;
		case 5:
			if(to_birds)
				fade_in(story[3], story[5]);
			else
				fade_in(story[4], story[5]);
			tint_rect();
			story_box(peace, width * 0.1675, height * 0.4, text_layer.textSize() * 4);
			clickIt = true;
			prev = story[5];
			break;
		case 6:
			fade_in(prev, story[2]);
			tint_rect();
			story_box(celebrate, width * 0.1675, height * 0.25, text_layer.textSize() * 5.5);
			if(show_alert) 
				alert_box(alert4, width * 0.15, height * 0.5, text_layer.textSize() * 2.5);
			input_box();
			clickIt = false;
			break;
		case 7:
			if(to_birds){ 					// Talk to birds
				if(talked_to_birdsB)
					story_box(birdsD, width * 0.2, height * 0.4, text_layer.textSize());
				else
					story_box(birdsC, width * 0.2, height * 0.4, text_layer.textSize() * 4);
				fade_in(story[2], story[3]);
				tint_rect();
				clickIt = true;
				prev = story[3];
			} else {						// Talk to beasts
				if(talked_to_beastsB)
					story_box(beastsD, width * 0.2, height * 0.4, text_layer.textSize() * 2.5);
				else
					story_box(beastsC, width * 0.15, height * 0.4, text_layer.textSize() * 2.5);
				fade_in(story[2], story[4]);
				tint_rect();
				clickIt = true;
				prev = story[4];
			}
			break;
		case 8:
			if(to_birds)
				fade_in(story[3], story[5]);
			else
				fade_in(story[4], story[5])
			tint_rect();
			story_box(finale, width * 0.15, height * 0.4, text_layer.textSize() * 5.5);
			clickIt = true;
			break;
		case 9:
			fade_in(story[5], story[0]);
			tint_rect();
			story_box(moral, width * 0.2, height * 0.25, text_layer.textSize() * 4);
			alert_box(end_alert, width * 0.05, height * 0.475, text_layer.textSize() * 2.5);
			clickIt = false;
			input_box();
			break;
		case "birds_end":
			fade_in(story[3], story[6]);
			tint_rect();
			story_box(birdsA, width * 0.175, height * 0.2, text_layer.textSize() * 5.5);
			if(show_alert)
				alert_box(end_alert, width * 0.05, height * 0.475, text_layer.textSize() * 2.5);
			input_box();
			break;
		case "beasts_end":
			fade_in(story[4], story[7]);
			story_box(beastsA, width * 0.075, height * 0.15, text_layer.textSize() * 10);
			if(show_alert)
				alert_box(end_alert, width * 0.05, height * 0.55, text_layer.textSize() * 2.5);
			tint_rect();
			input_box();
			break;
		default:
			break;
	}

	image(text_layer, 0, 0);
}

function tint_rect(){
	noStroke();
	fill(palette[0]);
	rect(0, 0, width, height);
	fill(0, 80);
	rect(0, 0, width, height);
}

// Title box function
function title_box(title, y_pos){
	text_layer.textSize(46);
	text_layer.fill(palette[5]);
	text_layer.text(title, width * 0.5 - text_layer.textWidth(title) * 0.5, y_pos, width * 0.5 + text_layer.textWidth(title) * 0.5, text_layer.textSize());
}

function subtitle_box(sub, y_pos){
	text_layer.textSize(36);
	text_layer.fill(palette[3]);
	text_layer.text(sub, width * 0.5 - text_layer.textWidth(sub) * 0.5, y_pos, width * 0.5 + text_layer.textWidth(sub) * 0.5, text_layer.textSize());
}

// Story box function
function story_box(story_text, x, y, h){
	var w = width - (2*x);
	text_layer.noStroke();
	text_layer.fill(palette[1]);
	text_layer.rect(x - 10, y, w + 10, h + 10);

	if(page_idx == 9) text_layer.textStyle(ITALIC);
	else text_layer.textStyle(NORMAL);

	text_layer.textAlign(CENTER);
	text_layer.textSize(32);
	text_layer.textLeading(48);
	text_layer.fill(palette[3]);
	text_layer.text(story_text, x, y, w, h);
}

function alert_box(alert_text, x, y, h){
	var w = width - (2*x);
	text_layer.noStroke();
	text_layer.fill(palette[1]);
	text_layer.rect(x - 10, y, w + 10, h + 10);

	text_layer.textStyle(ITALIC);
	text_layer.textAlign(CENTER);
	text_layer.textSize(32);
	text_layer.textLeading(48);
	text_layer.fill(palette[5]);
	text_layer.text(alert_text, x, y, w, h);	
	text_layer.textStyle(NORMAL);
}

function intro_alert_box(alert_text, x, y, size){
	var w = width - (2*x);
	text_layer.noStroke();
	text_layer.fill(palette[1]);
	text_layer.rect(x - 10, y, w + 10, size * 2.5 + 10);

	text_layer.textStyle(ITALIC);
	text_layer.textAlign(CENTER);
	text_layer.textSize(size);
	text_layer.textLeading(text_layer.textSize() * 1.5);
	text_layer.fill(palette[5]);
	text_layer.text(alert_text, x, y, w, text_layer.textSize() * 2.5);	
	
	text_layer.textStyle(NORMAL);
	text_layer.textAlign(LEFT);
}

// Text area and input function
var input_box = function() {

	// Text box
	text_layer.textAlign(LEFT);
	text_layer.noStroke();
	if(input.length < 1)
		text_layer.fill(255, 80);
	else
		text_layer.fill(255, 150);
	text_layer.rect(width * 0.5 - box_width/2, height * 0.75, box_width, box_height);

	// Input text
	text_layer.textSize(24);
	text_layer.noStroke();
	text_layer.fill(0);
	text_layer.text(input, width * 0.5 - text_layer.textWidth(input)/2, height * 0.75, width * 0.5 + text_layer.textWidth(input)/2, box_height);

	// Cursor function
	text_cursor();
}

// Draw cursor function
var text_cursor = function() {
	text_layer.strokeWeight(1);
	text_layer.stroke(0);
	
	if(frameCount % 10 == 0) 
		cursorIsVisible = !cursorIsVisible;
	if(cursorIsVisible)
		text_layer.line(width * 0.5 + text_layer.textWidth(input)/2, height * 0.75 + 2, width * 0.5 + text_layer.textWidth(input)/2, height * 0.75 + box_height - 2)
}

// Mouse callbacks
function mouseReleased(){
	if(clickIt) {
		check_forks();
		fade = 0;
	}
}

// Text callbacks
function keyTyped(){
	if(keyCode != RETURN){
		if(text_layer.textWidth(input) < (box_width - 20)){
			if(!clickIt) input += key;
		}
	}
}

function keyPressed(){

	if(keyCode == RETURN) {
		if(clickIt) {
			check_forks();
			fade = 0;
		} else
			check_input();	
	}

	if(keyCode == SHIFT) shiftIsDown = true;

	if(keyCode == BACKSPACE)
		if(shiftIsDown) 
			input = '';
		else 
			input = input.substring(0, input.length - 1);
}

function keyReleased(){
	if(keyCode == SHIFT) shiftIsDown = false;
}

function check_input(){
	switch(page_idx){
		case 3:
			if(input.toLowerCase() == "birds"){
				page_idx = 4;
				to_birds = true;
				show_alert = false;
				fade = 0;
			} else if (input.toLowerCase() == "beasts"){
				page_idx = 4;
				to_birds = false;
				show_alert = false;
				fade = 0;
			} else {
				show_alert = true;
			}
			break;
		case 4:
			if(to_birds){		// Talk to birds
				if(input.toLowerCase() == "yes"){
					page_idx = "birds_end";
					show_alert = true;
					fade = 0;
				} else if (input.toLowerCase() == "no") { 
					talked_to_birdsA = true;
					show_alert = false;
					fade = 0;
					if(talked_to_birdsA && talked_to_beastsA)
						page_idx = 5;
					else {
						page_idx = 3;
					}
				} else {
					show_alert = true;
				}
			} else {			// Talk to beasts
				if(input.toLowerCase() == "yes"){
					page_idx = "beasts_end";
					show_alert = true;
					fade = 0;
				} else if (input.toLowerCase() == "no"){ 
					talked_to_beastsA = true;
					show_alert = false;
					fade = 0;
					if(talked_to_birdsA && talked_to_beastsA)
						page_idx = 5;
					else {
						page_idx = 3;
					}
				} else {
					show_alert = true;
				}
			}
			break;
		case 6:
			if(input.toLowerCase() == "birds") {
				page_idx = 7;
				to_birds = true;
				show_alert = false;
				fade = 0;
			} else if (input.toLowerCase() == "beasts"){
				page_idx = 7;
				to_birds = false;
				show_alert = false;
				fade = 0;
			} else
				show_alert = true;
			break;
		case 9:
			if(input.toLowerCase() == "start over"){
				setup();
			}
			break;
		case "birds_end":
			if(input.toLowerCase() == "start over"){
				setup();
			}
			break;
		case "beasts_end":
			if(input.toLowerCase() == "start over"){
				setup();
			}
			break;
		default:
			break;
	}

	// Clear input
	input = "";
}

function check_forks() {
	switch(page_idx) {
		case 4:
			if(talked_to_birdsA && talked_to_beastsA)
				page_idx = 5;
			else
				page_idx = 3;
			break;
		case 7:
			if(to_birds) talked_to_birdsB = true;
			else talked_to_beastsB = true;
			
			if(talked_to_birdsB && talked_to_beastsB)
				page_idx = 8;
			else {
				page_idx = 6;
			}
			break;
		default:
			page_idx += 1;
			break;
	}
}

function fade_in(img_out, img_in){
	fade = constrain(fade += 1, 0, 40);
	tint(255, 255 - map(fade, 0, 40, 0, 255));
	image(img_out, 0, 0, width, height);
	tint(255, map(fade, 0, max_fade, 0, 255));
	image(img_in, 0, 0, width, height);
}