class playerMissile {
    constructor(x, y, w, h, angle) {
        //Setting the friction and restitution (elasticity) of the missile body
        var options={
            friction: 1.0,
            restitution: 0.8
        }
        //Setting parameters and loading the image
        this.width=w;
        this.height=h;
        this.image=loadImage("playerMissile.png");
        //Setting the launcher parameter to false, showing that the missile hasn't been laucnhed yet
        this.launched=false;

        //Creating the body
        this.body=Bodies.rectangle(x, y, this.width, this.height, options);
        //Setting the angle of the body to that entered in the constructor, so it isn't rotated at a weird angle relative to the launcher
        Matter.Body.setAngle(this.body, angle);

        //Adding the body to the world
        World.add(world, this.body);
    }

    display() {
        //Displaying this the same way I did for the launcher
        var pos=this.body.position;
        var angle=this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.image, 0, 0, this.width, this.height);
        pop();
    }

    //Writing a function to launch the missiles
    launch() {
        //Setting the launched parameter to true, since it has been launched if this fuction has been called
        this.launched=true;
        
        //Setting the velocity of the missile (The x is to propel it forward(To the right) and the y is to give the missile a parabloic trajectory)
        Matter.Body.setVelocity(this.body, {x:60, y:0.5});
    }
}