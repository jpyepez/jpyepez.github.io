
var lightning;
var rain;

var bg;
var img, mask;
var last, next;

var rainSound;
var thunder;

var soundIsInit;
var which;

function preload() {
    // Load image files
    bg = loadImage("assets/bg.jpg")
    img = loadImage("assets/City.jpg");
    mask = loadImage("assets/City.jpg");

    // Load audio files
    rainSound = loadSound("assets/rain.mp3");

    thunder = [];
    for (var i = 0, l = 3; i < l; i++) {
        var n = (i+1).toString();
        t = loadSound("assets/thunder" + n + ".mp3");
        thunder.push(t); 
    }
}

function setup() {
    createCanvas(800, 500);
    pixelDensity(1);
    background(0);

    lightning = new LBSys(); 
    rain = new Rain(30);

    // Lightning generation variables
    last = 0;
    rndNext(30, 120);

    // Image setup
    mask.loadPixels();
    for(var i = 0, l = mask.pixels.length; i+4 < l; i += 4) {
        var c = color(mask.pixels[i], mask.pixels[i+1], mask.pixels[i+2]);
        if(brightness(c) > 10)
            mask.pixels[i+3] = 0;
        else
            mask.pixels[i+3] = 255;
    }
    mask.updatePixels();

    img.mask(mask);

    // SoundFile setup
    rainSound.loop(0, 1.0, 0.1, 1.0, 30.0);
    rainSound.play();

    which = 0;  // Thunder SoundFile tracking variable
}

function draw() {
    soundSettings();                    // General sound settings

    image(bg, 0, 0, width, height);     // Draw background

    addNext();
    lightning.run();                    // Run lightning

    image(img, 0, 0, width, height);    // Draw skyline

    rain.run();                         // Run rain
}

// Function: add next lightning and reset counter
function addNext() {
    if((frameCount - last) >= next) {
        // Flash background
        noStroke();
        fill(255, 75);
        rect(0, 0, width, height);

        // Add lightning
        lightning.add();

        // Reset next
        last = frameCount;
        next = random(5, 60);
        rndNext(10, 120);

        // Play sound
        var tRate = random(0.5, 1.2);
        thunder[which % thunder.length].rate(tRate);
        if(thunder[which % thunder.length].isPlaying()){
            thunder[which % thunder.length].setVolume(0, 0.5);
            thunder[which % thunder.length].stop();
        }

        thunder[which % thunder.length].setVolume(0.1, 0.5);
        thunder[which % thunder.length].play();
        which++;
    }
}

// Time to next lightning
function rndNext(min, max) {
    next = random(min, max);
}

// Sound settings
function soundSettings() {
    rainSound.setVolume(0.1);
    
    for (var i = 0, l = thunder.length; i < l; i++) {
        thunder[i].setVolume(0.1);
    }
}

// function mouseReleased() {
//     lightning.add();
// }
