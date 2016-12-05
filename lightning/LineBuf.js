// LineBuf class
// Line object container, each one is "a lightning".
// Arguments: min scaling, max scaling (for next generation)
function LineBuf(min, max) {
    this.lines = [];
    this.min = min;
    this.max = max;
    this.limit = 512;
    this.counter = 0;
    this.ct_lim = 20;

    this.init = function() {
        var start = createVector(random(width), 0);
        var end = createVector(random(-1, 1), random(1));
        end.setMag(random(25, 35));
        end.add(start);
        var l = new Line(start, end, this, 0);

        this.lines.push(l);
    }


    this.update = function() {
        for (var i = 0, l = this.lines.length; i < l; i++) {
            this.lines[i].update();
        }
    }

    this.display = function() {
        for (var i = 0, l = this.lines.length; i < l; i++) {
            this.lines[i].display();
        }
    }

    this.run = function() {
        this.update();
        this.display();
    }

    // Check if lightning is still in progress
    // for display, growth and removal.
    this.isDrawing = function() {
        if(this.lines.length >= this.limit){
            this.counter++;
        }

        if(this.counter >= this.ct_lim) {
            return false;
        } else
            return true;
    }
}
