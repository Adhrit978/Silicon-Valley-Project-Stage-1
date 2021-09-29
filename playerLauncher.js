class playerLauncher {
    constructor(x, y, w, h) {
        //Making the launcher static so it doesn't fall (The sub is a sprite not a body)  
        var options={isStatic:true};
        //Setting various definitions and creating the body and loading teh image
        this.width=w;
        this.height=h;
        this.image=loadImage("playerLauncher.png");

        this.body=Bodies.rectangle(x, y, this.width, this.height, options);

        //Adding the body to the world
        World.add(world, this.body);
    }

    display() {
        //Defining the body's position and angle, and displaying it based on those variables
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