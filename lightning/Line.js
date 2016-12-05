// Line object
// Arguments: start, end, previous line, generation
// Lightning line, generates other lines (recursively add
// more Line objects to parent LineBufs).
function Line(start, end, buf, gen) {
    this.start = start.copy(); 
    this.end = end.copy(); 
    this.prog = start.copy(); 
    this.max = p5.Vector.sub(this.end, this.start).mag();
    this.curr = 0;
    this.parent = buf;
    this.isGrowing = true;
    this.gen = gen;

    this.update = function() {
        // Generate lightning fractal structure
        if(this.curr >= this.max){
            if(this.isGrowing) {
                if(this.parent.lines.length < this.parent.limit){
                    if(this.gen == 0)
                        var num = 2;
                    else
                        var num = floor(random(1, 3));

                    for (var i = 0; i < num; i++) {
                        var nextStart = this.end.copy();
                        var nextEnd = p5.Vector.fromAngle(PI/2 + random(-PI/4, PI/4));
                        nextEnd.setMag(this.max * random(this.parent.min, this.parent.max));
                        nextEnd.add(nextStart);
                        var l = new Line(nextStart, nextEnd, this.parent, this.gen + 1);

                        this.parent.lines.push(l);
                    }
                }
            }
            this.isGrowing = false;
        }

        // Draw lightning as it grows
        if(this.isGrowing){
            this.prog = p5.Vector.sub(this.end, this.start);
            this.prog.setMag(this.curr);
            this.prog.add(this.start);
            this.curr += 100;
        }
    }

    // Draw lightning on its current state
    this.display = function() {
        strokeWeight(map(this.gen, 0, 10, 2, 0.5));
        var a = map(this.gen, 0, 6, 150, 100) * map(this.parent.counter, 0, this.parent.ct_lim, 1, 0);
        stroke(255, a);
        if(this.isGrowing)
            line(this.start.x, this.start.y, this.prog.x, this.prog.y);
        else
            line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
}
