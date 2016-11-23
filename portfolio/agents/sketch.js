
// The Nature of Code
// Steering Forces: "Balance" 
// JP Yepez
// 11/19/16
/////////////

// Global variables
var hunters;
var prey;

var h_wander, h_pursue, h_cohesion, h_separation, h_alignment;
var p_wander, p_flee, p_cohesion, p_separation, p_alignment;

// Palette: Sky Blue Canyon
// http://www.colourlovers.com/palette/4370165/Sky_Blue_Canyon
var palette;
var bg;

function setup() {
    createCanvas(576, 432);

    palette = ['#82A0C2', '#1F5F8F', '#024186', '#0F1A1E', '#90A8C4'];

    // Generate background
    bg = setBg();

    // Initialize boid arrays
    hunters = new HunterFlock();
    hunters.init(30);

    prey = new PreyFlock();
    prey.init(6);

    // Prototyping sliders
    h_wander = createSlider(0, 4, 0.75, 0.01);
    h_pursue = createSlider(0, 4, 2, 0.1);
    h_cohesion = createSlider(0, 4, 1, 0.1);
    h_separation = createSlider(0, 4, 2, 0.1);
    h_alignment = createSlider(0, 4, 0.75, 0.1);

    p_wander = createSlider(0, 4, 0.5, 0.01);
    p_flee = createSlider(0, 4, 2.5, 0.1);
    p_cohesion = createSlider(0, 4, 0.25, 0.1);
    p_separation = createSlider(0, 4, 1, 0.1);
    p_alignment = createSlider(0, 4, 1, 0.1);

    h_wander.position(width + 2, 2);
    h_pursue.position(h_wander.x, h_wander.height + 2);
    h_cohesion.position(h_wander.x, 2 * (h_wander.height + 2));
    h_separation.position(h_wander.x, 3 * (h_wander.height + 2));
    h_alignment.position(h_wander.x, 4 * (h_wander.height + 2));

    p_wander.position(h_wander.x, 6 * (h_wander.height + 2));
    p_flee.position(h_wander.x, 7 * (h_wander.height + 2));
    p_cohesion.position(h_wander.x, 8 * (h_wander.height + 2));
    p_separation.position(h_wander.x, 9 * (h_wander.height + 2));
    p_alignment.position(h_wander.x, 10 * (h_wander.height + 2));

    // Hide sliders
    h_wander.hide();
    h_pursue.hide();
    h_cohesion.hide();
    h_separation.hide();
    h_alignment.hide();

    p_wander.hide();
    p_flee.hide();
    p_cohesion.hide();
    p_separation.hide();
    p_alignment.hide();
}

function draw() {
    image(bg, 0, 0, width, height); // Draw background

    // Run boid arrays
    hunters.run();
    prey.run();
}

// Function: Generate background
function setBg() {
    background(palette[4]);
    noFill();

    push();
    translate(width*0.5, height*0.5);
    for (var i = 0, l = 300; i < l; i++) {
        strokeWeight(random(30));
        stroke(addAlpha(palette[1], random(25)));
        var rectsize = floor(random(width * 0.5, width));
        rect(random(-width, width), random(-height, height), rectsize, rectsize);
    }
    pop();
    filter(BLUR, 6);

    return get();
}

// Add alpha to color
function addAlpha(col, alpha) {
    col = color(col);
    return color(red(col), green(col), blue(col), alpha);
}
