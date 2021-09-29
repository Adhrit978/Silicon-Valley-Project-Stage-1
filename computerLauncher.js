class computerLauncher {
    //Exact same logic as launcher1.js, it's just a different image here
    constructor(x, y, w, h) {
      var options={isStatic:true};
        this.width=w;
        this.height=h;
        this.image=loadImage("computerLauncher.png");

        this.body=Bodies.rectangle(x, y, this.width, this.height, options);

        World.add(world, this.body);
    }

    display() {
        var pos=this.body.position;
        var angle=this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.image, 0, 0, this.width, this.height);
        pop();
    }
}