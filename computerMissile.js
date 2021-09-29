class computerMissile {
    //Exact same logic as missile1.js but with a different image, and the x velocity in the launch() function is negative because the target is to the left
    constructor(x, y, w, h, angle) {
        var options={
            friction: 1.0,
            restitution: 0.8
        }
        this.width=w;
        this.height=h;
        this.image=loadImage("computerMissile.png");
        this.launched=false;

        this.body=Bodies.rectangle(x, y, this.width, this.height, options);
        Matter.Body.setAngle(this.body, angle);

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

    launch() {
        this.launched=true;

        //The y velocity is negative here because the missiles get deflected by the lacunher downwards, so I need to give it some upward velocity
        Matter.Body.setVelocity(this.body, {x:-60, y:-0.5});
    }
}