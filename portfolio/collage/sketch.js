
// Introduction to Programming for the Visual Arts
// Collage
// JP Yepez
// 07/10/2016
/////////////

// Poem excerpt:
// Poem of Faces. (Leaves of Grass(1856))
// By Walt Whitman.

var img;
var img_idx;
var prev_x, prev_y;

var poem;
var poem_str;
var poem_lines;

var palettes;
var pal_idx;

var counter;
var text_x, text_y;
var phrase;

var face_layer, page_layer;

// Selected fonts
var fonts = ["Open Sans", "Slabo", "Oswald", "Raleway", "Lora"];

// Preload assets
function preload() {

	img = new Array(7);

	for(var i = 0; i < img.length; i++){
		img[i] = loadImage("assets/face" + nf(i+1, 1, 0) + ".jpg");
	}

	poem = loadStrings("assets/faces.txt");

    renogare = loadFont("assets/Renogare.ttf");
    fonts.push(renogare);
}

function setup() {
	createCanvas(1024, 768);
	background(255);
	pixelDensity(1);

	page_layer = createGraphics(width, height);
	face_layer = createGraphics(width, height);

	img_idx = floor(random(img.length));

	// Color palettes
	palettes = [[color(244, 243, 215, 50), color(216, 185, 123, 50), color(139, 90, 61, 180)],
	[color(165, 210, 223, 50), color(129, 182, 195, 50), color(32, 42, 20, 180)],
	[color(195, 228, 185, 50), color(172, 211, 187, 50), color(10, 171, 165, 140)],
	[color(210, 191, 227, 50), color(184, 156, 219, 50), color(30, 16, 50, 180)],
	[color(202, 220, 244, 50), color(160, 170, 180, 50), color(92, 98, 124, 180)]];

	// Previous location coordinates
	prev_x = -100;
	prev_y = -100;

	// Load poem
	poem_str = poem.toString();
	poem_lines = splitTokens(poem_str, "@");

  // console.log(poem_lines);

  //Initialize random variables
  counter = 0;
  phrase = floor(random(poem_lines.length));
  pal_idx = floor(random(palettes.length));
  console.log(pal_idx);

  page_layer.textFont(fonts[floor(random(fonts.length))]);
  rnd_text_size();
}

// Draw layers
function draw() {
	clear();
	draw_face();
	type_text();
}

// Draw face layer
function draw_face(){
	var last_face = face_layer.get();
	clear();
	image(last_face, 0, 0);

	var x = random(img[img_idx].width);
	var y = random(img[img_idx].height);
	var destX = map(x, 0, img[img_idx].width, 0, width);
	var destY = map(y, 0, img[img_idx].height, 0, height);

	var min_crop = 20;
	var max_crop = 50;
	var crop_w = random(min_crop, max_crop);
	var crop_h = random(min_crop, max_crop);
	
	var max_dx = map(max_crop, 0, img[img_idx].width, 0, width);
	var max_dy = map(max_crop, 0, img[img_idx].height, 0, height);
	
	var crop_dw = random(min_crop, max_dx);
	var crop_dh = random(min_crop, max_dy);

	var mid_x = destX + crop_dw/2;
	var mid_y = destY + crop_dh/2;

	face_layer.copy(img[img_idx], x, y, crop_w, crop_h, destX, destY, crop_dw, crop_dh);

	face_layer.stroke(255, 25);
	face_layer.strokeWeight(random(.5, 4));
	if(prev_x != -100 && prev_y != -100){
		face_layer.line(mid_x, mid_y, prev_x, prev_y);
	}

	prev_x = mid_x;
	prev_y = mid_y;

	face_layer.noStroke();
	face_layer.fill(lerpColor(palettes[pal_idx][0], palettes[pal_idx][1], random()));
	face_layer.rect(destX, destY, crop_dw, crop_dh);
}

// Draw text layer
function type_text(){
	var prev_page = page_layer.get()
	page_layer.clear();
	page_layer.image(prev_page, 0, 0);

	if(counter >= poem_lines[phrase].length){
		counter = 0;
		text_x = random(width/2);
		text_y = random(height);
		phrase = floor(random(poem_lines.length));
		
		page_layer.textFont(fonts[floor(random(fonts.length))]);
		rnd_text_size();
	}

	page_layer.noStroke();
	page_layer.fill(palettes[pal_idx][2]);
	var cur_char = poem_lines[phrase].charAt(counter);
	page_layer.text(cur_char, text_x, text_y);

	counter++;
	text_x += page_layer.textWidth(cur_char);

	image(page_layer, 0, 0);
}

function rnd_text_size() {
	page_layer.textSize(random(10, 40));
}

// Reset sketch
function mousePressed() {
	setup();
}
