
// Introduction to Programming for the Visual Arts
// Data Visualization: Guns and Crime
// JP Yepez
// 09/09/2016
/////////////

// Dataset file
var dataset;

// Data arrays
var years;        // Experiment years, range: 1980–2013 
var population;   // Population in thousands 
var handguns;     // Percentage households owning handguns (imputed handgun measurement)
var guns;         // Percentage households owning guns of any kind (imputed gun measurement)
var total_major;  // Total major crimes
var major_crime;  // Total major crimes per million population
var murder;       // Murders per million population
var rape;         // Rapes per million population
var robbery;      // Robberies per million population
var assault;      // Assaults per million population
var burglary;     // Burglaries per million population

// Global variables
var current_year;
var year_idx;

// Data bars
var hg_bar;
var gun_bar;
var tot_mc_bar;
var mc_bar;
var murder_bar;
var rape_bar;
var robbery_bar;
var assault_bar;
var burglary_bar;

// Data graph
var graph;

// Data pie
var pie;

// Palette
var palette;

function preload() {
    dataset = loadTable("assets/gcdata.csv", "header");
}

function setup() {
    createCanvas(1024, 768);
    pixelDensity(1);

    // Dummy RGB color stuff
    fill(255, 0, 0);
    rect(random(width), random(height), 10, 10);
    fill(0, 255, 0);
    rect(random(width), random(height), 10, 10);
    fill(0, 0, 255);
    rect(random(width), random(height), 10, 10);

    // Define palette colors
    // http://www.colorschemer.com/schemes/viewscheme.php?id=5106
    palette = ['#FFFFFF', '#CCCCFF', '#B9B1E2', '#6666CC', '#333399', '#666699', '#333366', '#3366CC', '#3399CC', '#3366CC', '#006666', '#336699', '#0099CC', '#3399CC', '#3399FF', '#53A1EB', '#99CCFF', '#99FFFF', '#6D7BA0', '#CCCCFF', '#663366', '#996699', '#CC99CC', '#333399', '#8575D7', '#9999CC', '#FFCCFF', '#FF99CC', '#996699', '#19224D', '#FFFFCC', '#CCCC99', '#999966', '#99CC99', '#669999', '#66CC99', '#99CC66', '#669966', '#336633', '#666666', '#CC9966', '#CCCC99', '#EBDDC0', '#F7ECD4', '#FFCC99', '#FFCCCC', '#FFCC66'];

    background(palette[43]);

    // Initialize arrays
    years = [];
    population = [];
    handguns = [];
    guns = [];
    total_major = [];
    major_crime = [];
    murder = [];
    rape = [];
    robbery = [];
    assault = [];
    burglary = [];

    // Store data in arrays
    for(var i = 0; i < dataset.getRowCount() - 1; i++){
        var y = dataset.getNum(i, "year");
        years.push(y);

        var p = dataset.getNum(i, "pop");
        population.push(p);

        var h = dataset.getNum(i, "phg");
        handguns.push(h);

        var g = dataset.getNum(i, "pgun");
        guns.push(g);

        var tmc = dataset.getNum(i, "totmajor");
        total_major.push(tmc);

        var mc = dataset.getNum(i, "majorcrime");
        major_crime.push(mc);

        var m = dataset.getNum(i, "murder");
        murder.push(m);

        var r = dataset.getNum(i, "rape");
        rape.push(r);

        var rob = dataset.getNum(i, "robbery");
        robbery.push(rob);

        var a = dataset.getNum(i, "assault");
        assault.push(a);

        var b = dataset.getNum(i, "burglary");
        burglary.push(b);
    }

    // Print arrays to console
    println("Years: ", years);
    println("Population: ", population);
    println("Pct. Handguns: ", handguns);
    println("Pct. Guns: ", guns);
    println("Total Major Crime: ", total_major);
    println("Total Major Crimes Per Million Pop: ", major_crime);
    println("Murder: ", murder);
    println("Rape: ", rape);
    println("Robbery: ", robbery);
    println("Assault: ", assault);
    println("Burglary: ", burglary);

    // Initialize timeline
    year_idx = dataset.getRowCount() - 2;
    current_year = years[year_idx];

    // Find max values for each array
    println("total_major", max(total_major));
    println("major_crime", max(major_crime));
    println("murder", max(murder));
    println("rape", max(rape));
    println("robbery", max(robbery));
    println("assault", max(assault));
    println("burglary", max(burglary));

    // Initialize bars
    hg_bar = new Bar(100, 325, 50, 150, handguns, 100, "vertical", palette[23], "Pct. households owning handguns", "float", true);
    gun_bar = new Bar(200, 325, 50, 150, guns, 100, "vertical", palette[22], "Pct. households owning guns of any kind", "float", true);
    tot_mc_bar = new Bar(300, 325, 50, 150, total_major, 1050000, "vertical", palette[11], "Total major crimes", "int", false);
    mc_bar = new Bar(400, 325, 50, 150, major_crime, 5000, "vertical", palette[2], "Total major crimes per million population", "float", false); 

    // Initialize graph
    graph = new Graph(50, 425, 750, 250, years, {"handguns": handguns, "guns": guns, "major_crime": major_crime});

    // Initialize pie
    pie = new Pie(650, 250, 200, 200, major_crime, {"murder": murder, "rape": rape, "robbery": robbery, "assault": assault, "burglary": burglary});
}

function draw() {
    background(palette[43]);

    // Main functions and objects
    timeline();
    bars(); 
    graph.run();
    pie.run();

    // Title
    simple_text("Guns and Crime", {"x": 50, "y": 70, "font": 'Oswald', "size": 56, "color": palette[4]});
}

// Timeline function
// Set current sketch year
function timeline() {
    if(frameCount % 120 == 0) {
        if(year_idx == 0)
            year_idx = years.length;
        year_idx--; 
    }
    current_year = years[year_idx];
    simple_text(current_year, {"x": 175, "y": 130, "size": 40, "color": palette[2]});
}

// Simple text function
// Assumes there will be arguments for x and y position 
// Optional args: w, h, font, size, color
function simple_text(txt, textobj) {
    noStroke();
    if(textobj.font)
        textFont(textobj.font);
    else textFont('Georgia');
    if(textobj.size)
        textSize(textobj.size);
    if(textobj.align && !textobj.alignv)
        textAlign(textobj.align);
    else if (textobj.align && textobj.alignv)
        textAlign(textobj.align, textobj.alignv);
    else textAlign(LEFT, CENTER);
    if(textobj.color)
        fill(textobj.color);
    if(textobj.x == "center")
        textobj.x = width/2 - textWidth(txt)/2;
    if(textobj.w && textobj.h)
        text(txt, textobj.x, textobj.y, textobj.w, textobj.h);
    else if(textobj.x && textobj.y)
        text(txt, textobj.x, textobj.y);
}

// Run all bar objects
function bars() {
    hg_bar.run();
    gun_bar.run();
    tot_mc_bar.run();
    mc_bar.run();

    stroke(palette[18]);
    line(hg_bar.getX(), hg_bar.getY(), mc_bar.getX() + mc_bar.getBarW(), mc_bar.getY());

}

// Bar class
// Args: x, y, w, h, data array, max value of array, vert/horiz, color, label, int/float, pct sign bool
function Bar(x, y, bar_w, bar_h, data, max_value, mode, col, label, type, pct){
    this.value = 0;
    this.target = 0;
    this.nd = new NumDisplay(0.15, type);
    pct? this.nd.setPct(true) : this.nd.setPct(false);

    this.update = function() {
        this.target = map(data[year_idx], 0, max_value, 0, bar_h);
        if(this.target != this.value) 
            this.value = lerp(this.value, this.target, 0.05);
    }

    this.display = function() {
        noStroke();
        fill(col);
        switch(mode){
            case "vertical":
                rect(x, y - this.value, bar_w, this.value);
                simple_text(label, {"x": x - bar_w/2, "y": y + 10, "w": bar_w * 2, "h": 100, "size": 12, "align": CENTER, "alignv": TOP, "color": palette[4]});
                break;
            case "horizontal":
                rect(x, y, this.value, bar_w);
                break;
        }
    }

    this.run = function() {
        this.nd.run(data[year_idx], {"x": x + bar_w/2, "y": y - this.value - 25, "size": 18, "align": CENTER, "alignv": TOP, "color": palette[4]});
        this.update();
        this.display();
    }

    this.getX = function() { return x; };
    this.getY = function() { return y; };
    this.getBarW = function() { return bar_w; };
    this.getValue = function() { return this.value; };
}

// Graph class
// Args: x, y, w, h, x_data array, y data object (arrays)
function Graph(x, y, w, h, x_data, y_data_obj) {
    this.prev = new Array(Object.keys(y_data_obj).length); 

    this.update = function() {
    }

    this.display = function() {

        // Draw back rectangle
        noStroke();
        fill(palette[42]);
        rect(x - 20, y - 10, w + 225, h + 60, 10);

        // Translate graph to (0, 0)
        push();
        translate(x, y + h);

        // Initialize/reset this.prev values
        for(var i = 0; i < this.prev.length; i++) {
            this.prev[i] = createVector(0, 0);
        }

        // Draw axes
        strokeWeight(4);
        stroke(palette[18]);
        noFill();
        line(0, 0, w - 5, 0);
        line(0, 0, 0, -h + 5);

        // Draw axis arrows
        noStroke();
        fill(palette[18]);
        triangle(w, 0, w - 15, -10, w - 15, 10);
        triangle(0, -h, -10, -h + 15, 10, -h + 15);

        // Draw segments
        var seg_w = (w - 20) / (x_data.length);
        for(var i = 1; i < x_data.length; i += 2){
            rect(i * seg_w, -h + 20, seg_w, h - 20);
        }        

        // Display year labels
        for(var i = 0; i < x_data.length; i++){
            push();
            translate(i * seg_w, 10);
            rotate(PI/4);
            simple_text(years[years.length - 1 - i], {"x": 0.01, "y": 0.01, "size": 14});
            pop();
        }

        // Draw labels rectangle
        fill(addAlpha(palette[25], 80));
        rect(w, -h * 0.85, 190, 185, 10); 

        // Draw data labels
        noStroke();
        fill(palette[23]);
        rect(w + 10, -h * 0.75, 10, 10);  
        simple_text("Pct. households owning handguns", {"x": w + 30, "y": -h * 0.75 - 14, "w": 150, "h": textSize() * 3, "size": 14, "color": palette[4]});
        fill(palette[22]);
        rect(w + 10, -h * 0.5 , 10, 10);  
        simple_text("Pct. households owning guns of any kind", {"x": w + 30, "y": -h * 0.5 - 14, "w": 180, "h": textSize() * 2.5, "size": 14, "color": palette[4]});
        fill(palette[2]);
        rect(w + 10, - h * 0.25, 10, 10);  
        simple_text("Total major crimes per million population", {"x": w + 30, "y": -h * 0.25 - 14, "w": 150, "h": textSize() * 2.5, "size": 14, "color": palette[4]});
        
        // Draw data lines
        noFill();
        stroke(palette[23]);
        if(y_data_obj.handguns){
            for(var i = 0; i < y_data_obj.handguns.length; i++){
                var hg_x = w - 2 * seg_w - i * seg_w;
                var hg_y = map(y_data_obj.handguns[i], 0, 100, 0, -h + 20);
                var hgpos = createVector(hg_x, hg_y);
                if(i == 1) {
                    var proj = p5.Vector.sub(this.prev[0], hgpos);
                    line(this.prev[0].x, this.prev[0].y, this.prev[0].x + proj.x, this.prev[0].y + proj.y);
                }
                if(i > 0)
                    line(this.prev[0].x, this.prev[0].y, hgpos.x, hgpos.y);
                this.prev[0] = hgpos.copy();
            }
        }

        stroke(palette[22]);
        if(y_data_obj.guns){
            for(var i = 0; i < y_data_obj.guns.length; i++){
                var g_x = w - 2 * seg_w - i * seg_w;
                var g_y = map(y_data_obj.guns[i], 0, 100, 0, -h + 20);
                var gpos = createVector(g_x, g_y); 
                if(i == 1) {
                    var proj = p5.Vector.sub(this.prev[1], gpos);
                    line(this.prev[1].x, this.prev[1].y, this.prev[1].x + proj.x, this.prev[1].y + proj.y);
                }
                if(i > 0)
                    line(this.prev[1].x, this.prev[1].y, gpos.x, gpos.y);
                this.prev[1] = gpos.copy();
            }
        }

        stroke(palette[2]);
        if(y_data_obj.major_crime){
            for(var i = 0; i < y_data_obj.major_crime.length; i++){
                var mc_x = w - 2 * seg_w - i * seg_w;
                var mc_y = map(y_data_obj.major_crime[i], 0, 5000, 0, -h + 20);
                var mcpos = createVector(mc_x, mc_y); 
                if(i == 1) {
                    var proj = p5.Vector.sub(this.prev[1], mcpos);
                    line(this.prev[1].x, this.prev[1].y, this.prev[1].x + proj.x, this.prev[1].y + proj.y);
                }
                if(i > 0)
                    line(this.prev[1].x, this.prev[1].y, mcpos.x, mcpos.y);
                this.prev[1] = mcpos.copy();
            }
        }

        // Draw rectangular indicator
        strokeWeight(3);
        stroke(palette[17]);
        fill(addAlpha(palette[16], 100));
        rect((years.length - 1 - year_idx) * seg_w, -h + 20, seg_w, h - 20); 

        pop();
    }

    this.run = function() {
        this.update();
        this.display();
    }
}

// Pie class
// Args: x, y, w, h, total array, data object with section arrays
function Pie(x, y, w, h, total, dataobj) {
    this.parts = [];
    this.colors = [palette[4], palette[1], palette[2], palette[25], palette[24]];
    this.labels = ["Murder", "Rape", "Robbery", "Assault", "Burglary"];
    
    for(var property in dataobj) {
        this.parts.push(dataobj[property]);
    }
    
    this.pct = new Array(this.parts.length);
    this.pct_target = new Array(this.parts.length);
    this.labels_target = new Array(this.parts.length);
    this.labels_current = new Array(this.parts.length);
    
    for(var i = 0; i < this.parts.length; i++) {
        this.pct[i] = 0;
        this.pct_target[i] = 0;
        this.labels_target[i] = 0;
        this.labels_current[i] = 0;
    }
    
    this.update = function() {
        for(var i = 0; i < this.parts.length; i++) {
            this.pct_target[i] = this.parts[i][year_idx]/total[year_idx];
            if(this.pct_target[i] != this.pct[i])
                this.pct[i] = lerp(this.pct[i], this.pct_target[i], 0.05);
        }
    }

    this.display = function() {
        noStroke();

        // Draw back rectangle
        noStroke();
        fill(palette[42]);
        rect(x - w/2 - 35, y - h/2 - 35, w + 260, h + 70, 10);

        // Draw reference line
        stroke(palette[25]);
        strokeWeight(3);
        line(mc_bar.getX() + mc_bar.getBarW(), mc_bar.getY() - mc_bar.getValue()/2, pie.getX() - pie.getW()/2, pie.getY());

        // Draw back rectangle
        fill(palette[2]);
        rectMode(CENTER);
        rect(x, y, w + 40, h + 40, 10);
        rectMode(CORNER);

        // Draw reference ellipse
        noStroke();
        fill(addAlpha(palette[19], 100));
        ellipse(x, y, w, h);

        var start = 0;

        for(var i = 0; i < this.parts.length; i++) {
            strokeWeight(2);
            stroke(255);
            fill(this.colors[i]);
            var end = start + 2 * PI * this.pct[i];
            arc(x, y, w, h, start, end, PIE);
            start = end;
        }
        
        // Draw labels rectangle
        noStroke();
        fill(addAlpha(palette[25], 80));
        rectMode(CENTER);
        rect(x + w + 20, y, 180, 200, 10); 
        rectMode(CORNER);

        // Draw pie data labels
        strokeWeight(1);
        for(var i = 0; i < this.parts.length; i++) {
            stroke(255);
            fill(this.colors[i]);
            rect(x + w/2 + 45, y - 100 + 200/(this.parts.length + 1) * (i + 1), 10, 10);
            this.labels_target[i] = this.parts[i][year_idx];
            if(this.labels_target[i] != this.labels_current[i])
                this.labels_current[i] = Math.round(lerp(this.labels_current[i], this.labels_target[i], 0.15) * 100) / 100;
            simple_text(this.labels[i] + ": " + this.labels_current[i], {"x": x + w/2 + 70, "y": y - 115 + 200/(this.parts.length + 1) * (i + 1), "w": 150, "h": textSize() * 3, "size": 14, "color": palette[4]});
        }
    }

    this.run = function() {
        this.update();
        this.display();
    }

    this.getX = function() { return x; };
    this.getY = function() { return y; };
    this.getW = function() { return w; };
    this.getH = function() { return h; };
}

// Add alpha to color
function addAlpha(col, alpha) {
    col = color(col);
    return color(red(col), green(col), blue(col), alpha);
}

// Interpolating number display
// Args: interpolation factor, int/float
function NumDisplay(interp, type) {
    this.num = 0;
    this.target = 0;
    this.pct = false;
    
    this.update = function(tar) {
        this.target = tar;
        if(this.target != this.num)
            this.num = lerp(this.num, this.target, interp);
    }

    this.display = function(textobj) {
        if(type == "int")
            simple_text(Math.round(this.num), textobj);        
        else if (type == "float")
            simple_text(Math.round(this.num * 100) / 100 + (this.pct? "%" : ""), textobj);        
    }

    this.run = function(tar, textobj) {
        this.update(tar);
        this.display(textobj);
    }

    this.setPct = function(state) { this.pct = state; };
}
