//Variables for the physics engine
const Engine=Matter.Engine;
const World=Matter.World;
const Body=Matter.Body;
const Bodies=Matter.Bodies;

let engine;
let world;

//Variables for the computer, player, and for the walls confining the player's movements
var computer;

var player;

var wall1;
var wall2;
var wall3;
var wall4;
var wall5;

//Creating variables for intervals in createObstacles()
var interval1=Math.round(Math.random(60, 90));
var interval2=Math.round(Math.random(120, 180));
var interval3=Math.round(Math.random(150, 240));

//Creating variables for the obstacle and the background's images
var backgroundImg;
var backgroundWinImg;
var backgroundLoseImg;
var obstacleImg;

//Creating a gameState variable and setting it to play
var gamestate="play";

function preload() {
  //Loading background image
  backgroundImg=loadImage("background.jpeg");
  backgroundWinImg=loadImage("backgroundWin.jpg");
  backgroundLoseImg=loadImage("backgroundLose.jpg");
  obstacleImg=loadImage("obstacle.png");
}

function setup() {
  //Creating the canvas and the physics engine
  createCanvas(windowWidth, windowHeight);

  engine=Engine.create();
  world=engine.world;

  player=new Player(200, height/2, 10, 10);
  
  computer=new Computer(width-200, height/2, 10, 10);
  computer.sprite.velocityX=7;
  computer.sprite.velocityY=7;
  createComputerMissiles();
  createComputerHomingMissiles();

  //Creating 4 walls to keep the submarines from colliding or going off-screen, and making them all invisible
  wall1=createSprite(0, height/2, 1, height*2);
  wall2=createSprite(width/2, height/2, 1, height*2);
  wall3=createSprite(width/2, 50, width*2, 1);
  wall4=createSprite(width/2, height, width*2, 1);
  wall5=createSprite(width, height/2, 1, height*2);
  wall1.visible=false;
  wall2.visible=false;
  wall3.visible=false;
  wall4.visible=false;
  wall5.visible=false;

  //Setting the value of the interval variables
  interval1=Math.round(Math.random(60, 90));
  interval2=Math.round(Math.random(120, 180));
  interval3=Math.round(Math.random(150, 240));
}

function draw() {
  //Updating the engine and
  Engine.update(engine);

  background(backgroundImg);

  //Only calling all these function is the gamestate is play
  if (gamestate=="play") {
    player.controls(wall1, wall2, wall3, wall4, wall5);
    player.handleMissiles();
    player.handleHomingMissiles(computer.sprite);
    player.handleMissileCollision(computer.missiles);
    player.handleMissileCollision(computer.homingMissiles);
    player.handleLife();

    computer.controls(wall1, wall2, wall3, wall4, wall5);
    computer.handleMissiles();
    computer.handleHomingMissiles(player.sprite);
    computer.handleMissileCollision(player.missiles);
    computer.handleMissileCollision(player.homingMissiles);
    computer.handleLife();

    createObstacles();

    drawSprites();
    
    player.handleLauncher();
    computer.handleLauncher();

    if (player.gamePassed==true) {
      gameState="pass";
      background(backgroundWinImg);
    }
    if (player.gameFailed==true) {
      gameState="fail";
      background(backgroundLoseImg);
    }
  }
}

function createComputerMissiles() {
  //Setting the value of the variable to be used in the interval section of the setInterval() function, which defines the gap between 2 callings of the code. If it's random the value will be different each time the game is played (Because the function is called in setup it doesn't update ecery frame)
  var interval=Math.round(random(2000, 3000));
  //Using setInterval() so missiles are launched at "reguler" intervals
  setInterval(function() {
    //Writing the function to be called in the regular intervals, which simply creates a missile, pushes it into the array, increasing the nmissiles by 1, and launching it
    computer.missile=new computerMissile(computer.x-40, computer.y-45, 100, 30, 0);
    computer.missiles.push(computer.missile);
    computer.nMissiles+=1;
    computer.missile.launch();
  }, /*Setting the actual regular interval, somewhere between 2 and 3 seconds*/ interval);
}

function createComputerHomingMissiles() {
  //No need for any targeting here, because the homing missiles just target the player's sub on their own.
  var interval=Math.round(random(5000, 10000));
  setInterval(function() {
    computer.homingMissile=new computerHomingMissile(computer.x-40, computer.y-45, 100, 30, 0);
    computer.homingMissiles.push(computer.homingMissile);
    computer.nHomingMissiles+=1;
  }, interval)
}

function createObstacles() {
  //Creating an array for the obstacles to detect collisions
  var obstacles=[];

  var obstacle=createSprite(width/2, Math.random(50, height-50), 50, 50);
  obstacles.push(obstacle);
  obstacle.addImage(obstacleImg);
  obstacle.scale=0.5;
  obstacle.lifetime=60;
  obstacle.velocityY=5;

  /*//Creating a for loop for the player's missile array and the obstacles array
  for (let i=0; i<player.missiles.length; i++) {
    for (let j=0; j<obstacles.length; j++) {
      //Checking the distance between the ith object in the player.missiles array and the jth object in the obstacles array.
      var distance=dist(player.missiles[i].body.position.x, player.missiles[i].body.position.y, obstacles[j].x, obstacles[j].y);
      //If the distance is less than 80, then remove the missile, destroy the obstacle, and splice both arrays
      if (distance<=80) {
        Matter.World.remove(world, missiles[i].body);
        missiles.splice(i, 1);
        obstacles[j].destroy();
        obstacles.splice(j, 1);
      }
    }
  }

  //Same as the block of code above, expcet with the player's homingMissiles array instead of the player's missiles one
  for (let i=0; i<player.homingMissiles.length; i++) {
    for (let j=0; j<obstacles.length; j++) {
      var distance=dist(player.homingMissiles[i].body.position.x, player.homingMissiles[i].body.position.y, obstacles[j].x, obstacles[j].y);
      if (distance<=80) {
        Matter.World.remove(world, player.homingMissiles[i].body);
        player.homingMissiles.splice(i, 1);
        obstacles[j].destroy();
      }
    }
  }*/
}

function keyPressed() {
  //All this only happens if the gamestate is play
  if (gamestate=="play") {
    //If space is pressed a missile is created via the class
    if (keyCode==32) {
      player.createMissiles();
    }

    //If s is pressed a homing missile is created via the class
    if (keyCode==83) {
      player.createHomingMissiles();
    }
  }
  //If the game is over, and the sweetalert shows up, and space is pressed, the game will be restarted because the swal normally disappears if space is pressed
  if (gamestate=="fail") {
    if (keyCode==32) {
      location.reload();
    }
  }
  if (gamestate=="pass") {
    if (keyCode==32) {
      location.reload();
    }
  }
}