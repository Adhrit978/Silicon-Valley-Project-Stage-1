class Player {
  constructor(x, y, w, h) {
      this.image=loadImage("playerSub.png");
      this.explosionImage=loadImage("explosion.png");

      this.sprite=createSprite(x, y, w, h);
      this.sprite.addImage(this.image);
      this.sprite.scale=0.75;

      this.launcher=new playerLauncher(this.sprite.x+40, this.sprite.y-45, 130, 50);

      this.life=200;
      
      this.gameFailed=false;
      this.gamePassed=false;

      this.missile;
      this.nMissiles=0;
      this.missiles=[];

      this.homingMissile;
      this.nHomingMissiles=0;
      this.homingMissiles=[];
  }

  handleLauncher() {
      Matter.Body.setPosition(this.launcher.body, {x:this.sprite.x+40, y:this.sprite.y-45});
      this.launcher.display();
  }

  controls(wall1, wall2, wall3, wall4, wall5) {
    //Making the sub move with the arrow keys
    if (keyDown(RIGHT_ARROW)) {
        this.sprite.x+=4;
    }
    
    if (keyDown(LEFT_ARROW)) {
        this.sprite.x-=4;
    }
      
    if (keyDown(UP_ARROW)) {
        this.sprite.y-=4;
    }
      
    if (keyDown(DOWN_ARROW)) {
        this.sprite.y+=4;
    }

    //Making the player's sub bounce off the walls declared when calling the function, so I don't have to put this code in sketch.js
    this.sprite.bounceOff(wall1);
    this.sprite.bounceOff(wall2);
    this.sprite.bounceOff(wall3);
    this.sprite.bounceOff(wall4);
    this.sprite.bounceOff(wall5);
  }

  createMissiles() {
    //THis only happens if there are less than 65 missiles launched
    if (this.nMissiles<65) {
      //Creating the missile, adding it to the array, increasing the nMissiles by 1, and launching the missile
      this.missile=new playerMissile(this.sprite.x+44, this.sprite.y-50, 100, 30, 0);
      this.missiles.push(this.missile);
      this.nMissiles+=1;
      this.missile.launch();
    }
  }

  handleMissiles() {
    //Only doing all this if there are less than 65 missiles launched
    if (this.nMissiles<65) {
        //Setting the text colour to black
        stroke("black");
        fill("black");
        //Setting the text colour to orange if there are less than 25 missiles left
        if (this.nMissiles>=40) {
        stroke("orange");
        fill("orange");
        }
        //Setting the text colour to red is there are less than 15 missiles left
        if (this.nMissiles>=50) {
        stroke("red");
        fill("red");
        }
        //Setting the text size and actually writing the text
        textSize(20);
        text(65-this.nMissiles+" missiles left", 15, 30);

        //Displaying all missiles launched and destroying the missile and splicing the missiles array is the missiles goes off-screen
        for (let i=0; i<this.missiles.length; i++) {
          this.missiles[i].display();
          if (this.missiles[i].body.position.x>=width||this.missiles[i].body.position.y>=height||this.missiles[i].body.position.x<=0||this.missiles[i].body.position.y<=0) {
            Matter.World.remove(world, this.missiles[i].body);
            this.missiles.splice(i, 1);
          }
        }
    }
    //writing else to show 0 missiles left in red if all missiles are used
    else {
        stroke("red");
        fill("red");
        textSize(20);
        text("0 missiles left", 15, 30);
    }
  }

  createHomingMissiles() {
    //Only doing this if there are less than 10 homing missiles already launched
    if (this.nHomingMissiles<10) {
      //Creating the missile, adding it to the array, and increasing the nHomingMissiels by 1
      this.homingMissile=new playerHomingMissile(this.sprite.x+44, this.sprite.y-50, 150, 45, 0);
      this.homingMissiles.push(this.homingMissile);
      this.nHomingMissiles+=1;
    }
  }

  handleHomingMissiles(target) {
    if (this.nHomingMissiles<10) {
        stroke("black");
        fill("black");
    
        if (this.nHomingMissiles>=3) {
          stroke("orange");
          fill("orange");
        }
    
        if (this.nHomingMissiles>=6) {
          stroke("red");
          fill("red");
        }
    
        text(10-this.nHomingMissiles+" homing missiles left", 15, 50);
    
        for (let i=0; i<this.homingMissiles.length; i++) {
          this.homingMissiles[i].display();
          //The findTarget had to be put here because the if conditions need to be constantly updated, for which it needs to be called in draw, same ad display().
          this.homingMissiles[i].findTarget(target);
        }
        //No need to remove the homing missile if it goes off-screen because that is impossible, the homing missile will just find the target
      }
      //Writing an 0 missiles left in red if all homing missiles are used
      else {
        stroke("red");
        fill("red");
        textSize(20);
        text("0 homing missiles left", 15, 50);
      }
  }

  handleMissileCollision(missilesarray) {
    for (let i=0; i<missilesarray.length; i++) {
      if (missilesarray[i]!=null) {
        var collidedWithSub=dist(missilesarray[i].body.position.x, missilesarray[i].body.position.y, this.x, this.y);
        var collidedWithLauncher=dist(missilesarray[i].body.position.x, missilesarray[i].body.position.y, this.launcher.body.position.x, this.launcher.body.position.y)
        if (collidedWithSub<=120||collidedWithLauncher<=60) {
          this.life-=10;
          var explosion=createSprite(missilesarray[i].body.position.x, missilesarray[i].body.position.y);
          explosion.addImage(this.explosionImage);
          explosion.scale=0.35;
          explosion.lifetime=4;

          Matter.World.remove(world, missilesarray[i].body);
          missilesarray.splice(i, 1);
        }
      }
    }
  }

  handleLife() {
    fill("red");
    rect(15, 60, 200, 15)
    stroke("green");
    fill("green");
    rect(15, 60, this.life, 15);
    stroke("black");
    noFill();
    rect(15, 60, 200, 15);

    if (this.life==0) {
      this.gameFailed=true;
      this.gameFail();
    }

    if (computer.life==0) {
      this.gamePassed=true;
      this.gamePass();
    }
  }

  gamePass() {
    swal(
      {
        title: `You win :)`,
        imageUrl:"https://raw.githubusercontent.com/Adhrit978/image/main/sub.png",
        imageSize: "222x222",
        confirmButtonText: 'Play again'
      },
      function (isConfirm) {
        if (isConfirm) {
          location.reload();
          gamestate="play";
        }
      }
    );
  }

  gameFail() {
    swal(
      {
        title: `You lose :(`,
        imageUrl:"https://raw.githubusercontent.com/Adhrit978/image/main/sub2.png",
        imageSize: "222x222",
        confirmButtonText: 'Play again'
      },
      function (isConfirm) {
        if (isConfirm) {
          location.reload();
          gamestate="play";
        }
      }
    );
  }
}