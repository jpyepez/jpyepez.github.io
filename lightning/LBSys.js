// Line Buffer System class
// LineBuf particle system
function LBSys() {
   this.buffers = []; 

    this.update = function() {
        this.buffers.forEach(function(b){
            b.update();
        }) 
    }

    this.display = function() {
        this.buffers.forEach(function(b){
            b.display();
        }) 
      
    }

    this.run = function() {
        this.cleanup();
        this.update();
        this.display();
    }

    this.add = function() {
        b = new LineBuf(0.55, 1.15)
        b.init();
        this.buffers.push(b);
    }

    // Remove LineBuf when done drawing
    this.cleanup = function() {
        this.buffers = this.buffers.filter(function(b){
            return b.isDrawing();
        })  
    }
}
