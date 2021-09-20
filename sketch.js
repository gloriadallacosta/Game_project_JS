/*

Gloria Dalla Costa - GAME PROJECT FINAL SUBMISSION

*/

var floorPosY; 					//renamed from floorPos_y for naming consistency
var scrollPos;
var gameCharWorldX; 			//renamed from gameChar_world_x for naming consistency

var isLeft;						//left button pressed
var isRight;					//right button pressed
var isFalling;					//player is falling
var isPlummeting;				//player is dying

var clouds;         			//varray of clouds
var mountains;      			//varray of mountains
var treesX;        				//varray of trees -- renamed from trees_x for naming consistency
var canyons;        			//varray of canyons
var collectables;   			//varray of collectables
var player;         			//variable containing position and size of the player
var enemies;					//array of enemies
var platforms;					//array of platforms
var flagpole;					//flagpole

var fallingSpeed;				//speed at which the player falls down

var jumpHeight;					//height of the jumps of the player

var gameScore; 					//the score - renamed from game_score to gameScore for naming consistency

var hudFont;					//font for the HUD

var goFont;						//font for gameover

var lives;						//number of remaining lives of the player

var initialNumberOfLives = 3;	//initial number of lives of the player

var playerDyingTimer;			//timer for the respawn of the player after dying

var soundLibrary = {
	jump: null,
	walk: null,
	pickObject: null,
	playerDead: null,
	soundtrack: null,
	tada: null,
	dyingSoundStarted: false,
	tadaSoundPlayed: false,
	reset: function(){
		dyingSoundStarted = false;
		tadaSoundPlayed = false;
	}
};		//object containing all the audio clips

//load all the assets before the game starts
function preload(){
	//loading fonts
	hudFont = loadFont("assets/fonts/Exo2-RegularCondensed.otf");
	goFont = loadFont("assets/fonts/Exo2-ExtraBoldCondensed.otf");

	//loading sounds
	//Occasionally I found an issue documented here
	//https://github.com/processing/p5.js-sound/issues/59
	//in certain occasions, the function isPlaying of a sound object returns true even though the sound is no longer playing

	soundLibrary.jump = loadSound('assets/sounds/jumping.wav');
	soundLibrary.jump.setVolume(0.8);

	soundLibrary.walk = loadSound('assets/sounds/footstep.wav');
	soundLibrary.walk.setVolume(1.0);

	soundLibrary.pickObject = loadSound('assets/sounds/pick_object.wav');
	soundLibrary.pickObject.setVolume(1.0);

	soundLibrary.playerDead = loadSound('assets/sounds/failure.wav');
	soundLibrary.playerDead.setVolume(1.0);

	//Credits to https://freesound.org/people/xsgianni/sounds/388079/
	soundLibrary.soundtrack = loadSound('assets/sounds/388079__xsgianni__mario-s-way.mp3');
	soundLibrary.soundtrack.setVolume(1.0);

	//Credits to https://freesound.org/people/rhodesmas/sounds/320657/
	soundLibrary.tada = loadSound('assets/sounds/376318__jimhancock__tada.wav');
	soundLibrary.tada.setVolume(1.0);
}

function startGame(){
	fallingSpeed= 3; 			//determines how fast the player falls
	jumpHeight = 120; 			//determines how high the player jumps
	gameScore = 0;				//player initial score
	playerDyingTimer = 0;		//initialize timer

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.

	//Populate the array with cloud objects
	clouds = [
		{
			xPos: -550,
			yPos: 120,
			width: 150,
			height: 55
		},
		{
			xPos: -380,
			yPos: 220,
			width: 100,
			height: 35
		},
		{
			xPos: -200,
			yPos: 280,
			width: 50,
			height: 20
		},
		{
			xPos: 0,
			yPos: 100,
			width: 70,
			height: 30
		},
		{
			xPos: 150,
			yPos: 120,
			width: 150,
			height: 55
		},
		{
			xPos: 380,
			yPos: 220,
			width: 100,
			height: 35
		},
		{
			xPos: 850,
			yPos: 280,
			width: 50,
			height: 20
		},
		{
			xPos: 750,
			yPos: 100,
			width: 70,
			height: 30
		},
		{
			xPos: 900,
			yPos: 100,
			width: 70,
			height: 30
		},
		{
			xPos: 1150,
			yPos: 120,
			width: 150,
			height: 55
		},
		{
			xPos: 1380,
			yPos: 220,
			width: 100,
			height: 35
		},
		{
			xPos: 1600,
			yPos: 280,
			width: 50,
			height: 20
		},
		{
			xPos: 1750,
			yPos: 100,
			width: 70,
			height: 30
		},
		{
			xPos: 1900,
			yPos: 130,
			width: 70,
			height: 50
		},
		{
			xPos: 2100,
			yPos: 100,
			width: 60,
			height: 40
		},
		{
			xPos: 2400,
			yPos: 120,
			width: 70,
			height: 35
		},
		{
			xPos: 2500,
			yPos: 180,
			width: 100,
			height: 55
		},
		{
			xPos: 2800,
			yPos: 140,
			width: 75,
			height: 30
		},
		{
			xPos: 2900,
			yPos: 150,
			width: 80,
			height: 35
		},
		{
			xPos: 3050,
			yPos: 120,
			width: 90,
			height: 55
		},
		{
			xPos: 3150,
			yPos: 100,
			width: 80,
			height: 40
		}
	];

	//Populate the array with mountain objects
	mountains = [
		{
			xPos: -200,
			yPos: floorPosY,
			width: 120,
			height:102
		},
		{
			xPos: -780,
			yPos: floorPosY,
			width: 100,
			height:102
		},
		{
			xPos: -355,
			yPos: floorPosY,
			width: 150,
			height:132
		},
		{
			xPos: -405,
			yPos: floorPosY,
			width: 250,
			height:232
		},
		{
			xPos: -650,
			yPos: floorPosY,
			width: 250,
			height:260
		},
		{
			xPos: 200,
			yPos: floorPosY,
			width: 100,
			height:102
		},
		{
			xPos: 750,
			yPos: floorPosY,
			width: 100,
			height:102
		},
		{
			xPos: 325,
			yPos: floorPosY,
			width: 150,
			height:132
		},
		{
			xPos: 425,
			yPos: floorPosY,
			width: 250,
			height:232
		},
		{
			xPos: 600,
			yPos: floorPosY,
			width: 250,
			height:260
		},
		{
			xPos: 800,
			yPos: floorPosY,
			width: 100,
			height:102
		},
		{
			xPos: 950,
			yPos: floorPosY,
			width: 100,
			height:102
		},
		{
			xPos: 1025,
			yPos: floorPosY,
			width: 150,
			height:132
		},
		{
			xPos: 1225,
			yPos: floorPosY,
			width: 250,
			height:232
		},
		{
			xPos: 1400,
			yPos: floorPosY,
			width: 250,
			height:260
		},
		{
			xPos: 1550,
			yPos: floorPosY,
			width: 250,
			height:240
		},
		{
			xPos: 1800,
			yPos: floorPosY,
			width: 170,
			height:180
		},
		{
			xPos: 1670,
			yPos: floorPosY,
			width: 210,
			height:220
		},
		{
			xPos: 1900,
			yPos: floorPosY,
			width: 220,
			height:250
		},
		{
			xPos: 2500,
			yPos: floorPosY,
			width: 220,
			height:190
		},
		{
			xPos: 2150,
			yPos: floorPosY,
			width: 250,
			height:260
		},
		{
			xPos: 2700,
			yPos: floorPosY,
			width: 200,
			height:210
		},
		{
			xPos: 2050,
			yPos: floorPosY,
			width: 200,
			height:200
		},
		{
			xPos: 2320,
			yPos: floorPosY,
			width: 250,
			height:180
		},
		{
			xPos: 3200,
			yPos: floorPosY,
			width: 220,
			height:210
		},
		{
			xPos: 2980,
			yPos: floorPosY,
			width: 270,
			height:260
		},
		{
			xPos: 3100,
			yPos: floorPosY,
			width: 240,
			height:240
		},
		{
			xPos: 3320,
			yPos: floorPosY,
			width: 240,
			height:250
		},
		{
			xPos: 2820,
			yPos: floorPosY,
			width: 140,
			height:160
		},
		{
			xPos: 3380,
			yPos: floorPosY,
			width: 220,
			height:230
		},
		{
			xPos: 3320,
			yPos: floorPosY,
			width: 240,
			height:250
		},
		{
			xPos: 3500,
			yPos: floorPosY,
			width: 250,
			height:210
		}
	];

	//Populate the array with tree positions
	treesX = [
		-800,
		-600,
		-420,
		-190,
		100,
		250,
		400,
		700,
		900,
		1000,
		1390,
		1550,
		1800,
		2050,
		2400,
		2550,
		2750,
		3050
	];

	//Populate the array with canyon objects
	canyons = [
		{
			xPos: 600,
			yPos: floorPosY,
			width: 100,
			height: height - floorPosY,
			spikeH: 80,
			spikeNum: 9
		},
		{
			xPos: 1300,
			yPos: floorPosY,
			width: 100,
			height: height - floorPosY,
			spikeH: 80,
			spikeNum: 9
		},
		{
			xPos: 2600,
			yPos: floorPosY,
			width: 150,
			height: height - floorPosY,
			spikeH: 80,
			spikeNum: 9
		}
	];

	//Populate the array with collectables objects
	collectables = [
		new collectable(0, floorPosY, 30, 0),
		new collectable(220, floorPosY-100, 30, 5),
		new collectable(250, floorPosY-100, 30, 5),
		new collectable(280, floorPosY-100, 30, 4),
		new collectable(310, floorPosY-100, 30, 4),
		new collectable(340, floorPosY-100, 30, 5),
		new collectable(370, floorPosY-100, 30, 5),

		new collectable(295, floorPosY-200, 30, 3),
		new collectable(370, floorPosY-300, 30, 1),

		new collectable(420, floorPosY-200, 30, 3),
		new collectable(450, floorPosY-200, 30, 2),
		new collectable(480, floorPosY-200, 30, 3),

		new collectable(550, floorPosY-300, 30, 1),
		new collectable(600, floorPosY-300, 30, 1),

		new collectable(600, floorPosY-50, 30, 2),
		new collectable(700, floorPosY-50, 30, 2),

		new collectable(670, floorPosY-200, 30, 3),
		new collectable(700, floorPosY-200, 30, 2),
		new collectable(730, floorPosY-200, 30, 3),

		new collectable(800, floorPosY-300, 30, 1),

		new collectable(850, floorPosY, 30, 0),
		new collectable(950, floorPosY, 30, 1),
		new collectable(1050, floorPosY, 30, 0),

		new collectable(1050, floorPosY-100, 30, 2),
		new collectable(1020, floorPosY-100, 30, 2),

		new collectable(1170, floorPosY-200, 30, 3),
		new collectable(1200, floorPosY-200, 30, 2),
		new collectable(1230, floorPosY-200, 30, 3),

		new collectable(1500, floorPosY-300, 30, 1),
		new collectable(1550, floorPosY-300, 30, 1),
		new collectable(1500, floorPosY-200, 30, 3),
		new collectable(1550, floorPosY-200, 30, 3),
		new collectable(1500, floorPosY-100, 30, 4),
		new collectable(1550, floorPosY-100, 30, 4),

		new collectable(1550, floorPosY, 30, 0),

		new collectable(1850, floorPosY-300, 30, 1),
		new collectable(1900, floorPosY-300, 30, 1),
		new collectable(1850, floorPosY-200, 30, 4),
		new collectable(1900, floorPosY-200, 30, 4),
		new collectable(1850, floorPosY-100, 30, 5),
		new collectable(1900, floorPosY-100, 30, 5),


		new collectable(1695, floorPosY, 30, 1),
		new collectable(1725, floorPosY, 30, 2),
		new collectable(1755, floorPosY, 30, 1),

		new collectable(1900, floorPosY, 30, 0),
		new collectable(2050, floorPosY, 30, 0),
		new collectable(2100, floorPosY, 30, 0),
		new collectable(2150, floorPosY, 30, 0),
		new collectable(2300, floorPosY, 30, 3),
		new collectable(2330, floorPosY, 30, 4),
		new collectable(2360, floorPosY, 30, 3),
		new collectable(2300, floorPosY-100, 30, 2),
		new collectable(2330, floorPosY-100, 30, 5),
		new collectable(2360, floorPosY-100, 30, 2),



		new collectable(2475, floorPosY, 30, 0),


		new collectable(2520, floorPosY-100, 30, 3),
		new collectable(2550, floorPosY-100, 30, 2),
		new collectable(2580, floorPosY-100, 30, 3),

		new collectable(2770, floorPosY-100, 30, 4),
		new collectable(2800, floorPosY-100, 30, 5),
		new collectable(2830, floorPosY-100, 30, 4),

		new collectable(2650, floorPosY-200, 30, 4),
		new collectable(2700, floorPosY-200, 30, 5)
	];

	//assigns initial values to the player object
	player = {

		xPos: width/2,
		yPos: floorPosY,
		size: 1,
		speed: 5,
		ground: floorPosY, //New variable introduced to manage the depth of the canyon during the character fall.
		data: {
			headCenterX: 0,
			headCenterY: -65,
			headDiameter: 16,

			bodyW: 10,
			bodyH: 26,
			bodyRoundCorners: 3,

			legW: 3,
			legH:12,
			legRoundCorners: 1,

			footDiameterX: 4,
			footDiameterY: 2,

			armW: 3,
			armH: 12,
			armRoundCorners: 1,

			handDiameter: 3,

			padding: 1
		}
	};

	//initialize the flagpole
	flagpole = {
		xPos: 3000,
		scale: 120,
		isReached: false
	};

	//Populate the array with enemies
	enemies = [
		new boss(-300, floorPosY, 150, 150),
		new boss(-100, floorPosY, 150, 150),
		new enemy(800, floorPosY, 95, 70),
		new enemy(1000, floorPosY, 101, 70),
		new enemy(1500, floorPosY, 120, 70),
		new enemy(1855, floorPosY, 99, 70),
		new boss(2000, floorPosY, 200, 150),
		new enemy(2450, floorPosY, 90, 70)
	];

	//Populate the array with platforms
	platforms = [
		createPlatform(200, floorPosY-100, 10),
		createPlatform(400, floorPosY-200, 5),
		createPlatform(650, floorPosY-200 , 5),

		createPlatform(1150, floorPosY-100, 5),
		createPlatform(1250, floorPosY-200, 10),
		createPlatform(1600, floorPosY-200, 10),
		createPlatform(1950, floorPosY-200, 10),

		createPlatform(2500, floorPosY-100, 5),
		createPlatform(2750, floorPosY-100, 5),
		createPlatform(2605, floorPosY-200, 7)
];

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameCharWorldX = player.xPos - scrollPos;

	//start the soundtrack and loop it
	soundLibrary.reset();
	if(!soundLibrary.soundtrack.isPlaying())
		soundLibrary.soundtrack.loop();
}


function setup()
{
	createCanvas(1024, 576);

	floorPosY = height * 3/4;
	initialNumberOfLives = 3;
	lives = initialNumberOfLives;

	startGame();
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPosY, width, height/4); // draw some green ground

	push();
	translate(scrollPos, 0);

	// Draw clouds.
	drawClouds(clouds);
	// Draw mountains.
	drawMountains(mountains);
	// Draw trees.
	drawTrees(treesX)
	// Draw canyons.
	drawCanyons(canyons);

	//check collectables
	for(var i = 0; i < collectables.length; i++){
		if(collectables[i].checkContact(gameCharWorldX, player.yPos)){
			//if found
			gameScore+= collectables[i].score;
			console.log("gamescore: " + gameScore);
			soundLibrary.pickObject.play();
		}
		else{
			//If not found, draw collectable item
			collectables[i].draw();
		}
	}

	drawFlagpole(flagpole);

	//draw platforms
	for(var i = 0; i < platforms.length; i++){
		platforms[i].draw();
	}

	//draw enemies
	for(var i = 0; i < enemies.length; i++){
		enemies[i].draw();

		//check for contact
		var isContact = enemies[i].checkContact(gameCharWorldX, player.yPos);

		if(isContact){
			//player dies
			if(lives > 0) isPlummeting = true;
			break;
		}
	}

	pop();

	// Draw game character.
	drawGameChar();

	//draw hud
	drawHud();

	if(lives < 1){
		drawGameOver();	//game over!
		return;
	}

	//check if level is completed
	if(flagpole.isReached){
		soundLibrary.soundtrack.stop();
		drawLevelCompleted();
		if(!soundLibrary.tada.isPlaying() && !soundLibrary.tadaSoundPlayed)
		{
			soundLibrary.tada.play();
			soundLibrary.tadaSoundPlayed = true;
		}
		return;
	}

	checkFlagpole(flagpole);

	//if player is dead don't go any further
	if(isPlummeting){
		//Set the time of the pause period after player's dead
		if(playerDyingTimer == 0)
			playerDyingTimer = Date.now();

		//Checks whether the sound has already played. This is a workaround for the issue
		//SoundFile.isPlaying() reports true after sound has ended for multiplayed sound #59
		//https://github.com/processing/p5.js-sound/issues/59
		if(soundLibrary.dyingSoundStarted != true) {
			soundLibrary.soundtrack.stop();
			soundLibrary.playerDead.play();
			soundLibrary.dyingSoundStarted = true;
		}

		if(Math.abs(new Date() - playerDyingTimer) < 2500)
		{
			return;
		}
		soundLibrary.dyingSoundStarted = false;
		playerDyingTimer = 0;
		lives--;
		if(lives>0)
			startGame();

	}

	//check whether the player is over a canyon
	var inCanyon = checkCanyons(canyons);

	//check whether the player is on a platform
	var onPlatform = checkPlatforms(platforms);

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(player.xPos > width * 0.2)
		{
			player.xPos -= player.speed;
		}
		else
		{
			scrollPos += player.speed;
		}
		if(!soundLibrary.walk.isPlaying() && !isFalling)
			soundLibrary.walk.play();
	}

	if(isRight)
	{
		if(player.xPos < width * 0.8)
		{
			player.xPos  += player.speed;
		}
		else
		{
			scrollPos -= player.speed; // negative for moving against the background
		}
		if(!soundLibrary.walk.isPlaying() && !isFalling)
			soundLibrary.walk.play();
	}
	
	if(inCanyon){
		console.log("in canyon");

		//player is over a canyon
		player.ground = inCanyon.yPos + inCanyon.height; //this is the new ground level for the player
		if(player.yPos > floorPosY){
			//if the player is falling within a canyon, constrain its position within the canyon boundaries.
			//Note: gameCharWorldX must be used to calculate the constraint, but the player.xPos has to be eventually updated.
			player.xPos = scrollPos + constrain(gameCharWorldX, inCanyon.xPos + player.data.bodyW, inCanyon.xPos + inCanyon.width - player.data.bodyW); // if the player is within the canyon and below the ground level, its x coordinate are constrained within the canyon
		}
		if(player.yPos >= inCanyon.yPos + inCanyon.height){ //if the player reaches the bottom of the canyon
			isPlummeting = true;
		}
	}


	if(onPlatform){
		//console.log("on platform");
		player.ground = onPlatform.y;
	}

	if(!inCanyon && !onPlatform){
		player.ground = floorPosY;
	}

	if(player.yPos < player.ground){
		player.yPos += fallingSpeed;
		//The next instruction is to keep the player on the platform. If player.yPos + fallingSpeed is greater than the player.ground,
		// at the next iteration the variable onPlatform will be false
		player.yPos = min(player.yPos, player.ground);
		isFalling = true;
		//console.log("player.yPos: " + player.yPos + ", player.ground: " + player.ground );

	}else
	{
		isFalling = false;
	}

	// Update real position of gameChar for collision detection.
	gameCharWorldX = player.xPos - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
	// if statements to control the animation of the character when
	// keys are pressed.
	if(keyCode == 39){
		isRight = true;
		//soundLibrary.walk.play();
		console.log("isRight: " + isRight);
		}
	else if(keyCode == 37)
	{
		isLeft = true;
		//soundLibrary.walk.play();
		console.log("isLeft: " + isLeft);
		}
	else if(keyCode == 32 && lives == 0){
		lives = initialNumberOfLives;
		startGame();
	}
	else if(keyCode == 32 && flagpole.isReached){
		startGame();
	}
	else if(keyCode == 32 && player.yPos == player.ground){
		player.yPos -= jumpHeight;
		soundLibrary.jump.play();
		//jumpSound.play();
	}
	//open up the console to see how these work
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.

	if(keyCode == 39){
		isRight = false;
		console.log("isRight: " + isRight);
	}
	else if(keyCode == 37)
	{
		isLeft = false;
		console.log("isLeft: " + isLeft);
	}
	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
	// draw game character
	if(isPlummeting)
	{
		drawJumpingFrontCharacter(player);
		return; //stops the execution in case of Plummeting
	}
	//the game character
	else if(isLeft && isFalling)
	{
		// add your jumping-left code
		drawJumpingLeftCharacter(player);
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		drawJumpingRightCharacter(player);
	}
	else if(isLeft)
	{
		// add your walking left code
		drawWalkingLeftCharacter(player);
	}
	else if(isRight)
	{
		// add your walking right code
		drawWalkingRightCharacter(player);
	}
	else if(isFalling)
	{
		// add your jumping facing forwards code
		drawJumpingFrontCharacter(player);
	}
	else
	{
		// add your standing front facing code
		drawFrontFacingCharacter(player);
	}
}

function drawFrontFacingCharacter(player){
	//draw head
	fill(0, 200, 255);
	ellipse(
		player.xPos + player.data.headCenterX,
		player.yPos + player.data.headCenterY * player.size,
		player.data.headDiameter * player.size,
		player.data.headDiameter * player.size); //head

	//draw body
	fill(255, 100, 0);
	rect(
		player.xPos - player.data.bodyW/2 * player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + player.data.padding) * player.size,
		player.data.bodyW * player.size,
		player.data.bodyH * player.size,
		player.data.bodyRoundCorners * player.size); //body

	//draw left upper leg
	fill(70, 90, 165);
	rect(
		player.xPos - player.data.bodyW / 2 * player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding) * player.size,
		player.data.legW * player.size,
		player.data.legH * player.size,
		player.data.legRoundCorners * player.size); //left upper leg

	//draw left lower leg
	fill(70, 90, 165);
	rect(
		player.xPos - player.data.bodyW / 2 * player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.legH + player.data.padding) * player.size,
		player.data.legW * player.size,
		player.data.legH * player.size,
		player.data.legRoundCorners * player.size); //left lower leg

	//draw left foot
	fill(200, 0, 50);
	ellipse(
		player.xPos + (player.data.footDiameterX - player.data.bodyW )/2 * player.size,
		player.yPos - player.data.footDiameterY * player.size,
		player.data.footDiameterX * player.size,
		player.data.footDiameterY * player.size); //left foot

	//draw right upper leg
	fill(70, 90, 165);
	rect(
		player.xPos + 2 * player.data.padding * player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding) * player.size,
		player.data.legW * player.size,
		player.data.legH * player.size,
		player.data.legRoundCorners * player.size); //right upper leg

	//draw right lower leg
	fill(70, 90, 165);
	rect(
		player.xPos + 2 * player.data.padding * player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.legH + player.data.padding) * player.size,
		player.data.legW * player.size,
		player.data.legH * player.size,
		player.data.legRoundCorners * player.size); //right lower leg

	//draw right foot
	fill(200, 0, 50);
	ellipse(
		player.xPos +  player.data.footDiameterX * player.size,
		player.yPos - player.data.footDiameterY * player.size,
		player.data.footDiameterX * player.size,
		player.data.footDiameterY * player.size); //right foot

	//draw left upper arm
	fill(224, 160, 0);
	rect(
		player.xPos - (player.data.bodyW / 2  + player.data.padding + player.data.armW)* player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding) * player.size,
		player.data.armW * player.size,
		player.data.armH * player.size,
		player.data.armRoundCorners * player.size); //left upper arm

	//draw left lower arm
	fill(0, 200, 255);
	rect(
		player.xPos - (player.data.bodyW / 2 + player.data.padding + player.data.armW) * player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + 4* player.data.padding + player.data.armH) * player.size,
		player.data.armW * player.size,
		player.data.armH * player.size,
		player.data.armRoundCorners * player.size); //left lower arm

	//draw left hand
	fill(0, 200, 255);
	ellipse(
		player.xPos - (player.data.bodyW / 2 + 2*player.data.padding) * player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + 5* player.data.padding + 2 * player.data.armH + player.data.handDiameter / 2) * player.size,
		player.data.handDiameter * player.size,
		player.data.handDiameter * player.size); //left hand

	//draw right upper arm
	fill(224, 160, 0);
	rect(
		player.xPos + (player.data.bodyW / 2 + player.data.padding) * player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding) * player.size,
		player.data.armW * player.size,
		player.data.armH * player.size,
		player.data.armRoundCorners * player.size); //right upper arm

	//draw right lower arm
	fill(0, 200, 255);
	rect(
		player.xPos + (player.data.bodyW / 2 + player.data.padding) * player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + 4* player.data.padding + player.data.armH) * player.size,
		player.data.armW * player.size,
		player.data.armH * player.size,
		player.data.armRoundCorners * player.size); //right lower arm

	//draw right hand
	fill(0, 200, 255);
	ellipse(
		player.xPos + (player.data.bodyW / 2 + player.data.padding + player.data.handDiameter/2) * player.size,
		player.yPos + (player.data.headCenterY + player.data.headDiameter/2 + 5* player.data.padding + 2 * player.data.armH + player.data.handDiameter / 2) * player.size,
		player.data.handDiameter * player.size,
		player.data.handDiameter * player.size); //right hand
}

function drawWalkingRightCharacter(player){
	fill(0, 200, 255);
	ellipse(
		player.xPos + player.data.headCenterX,
		player.yPos + player.data.headCenterY,
		player.data.headDiameter,
		player.data.headDiameter); //head

	fill(255, 100, 0);
	rect(
		player.xPos - player.data.bodyW/2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding,
		player.data.bodyW,
		player.data.bodyH,
		player.data.bodyRoundCorners); //body

	fill(70, 90, 165);
	rect(
		player.xPos + player.data.legW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left upper leg

	fill(70, 90, 165);
	rect(
		player.xPos + player.data.legW,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.legH + player.data.padding,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left lower leg

	fill(200, 0, 50);
	ellipse(
		player.xPos + player.data.legW + player.data.footDiameterX,
		player.yPos - player.data.footDiameterY,
		2 * player.data.footDiameterX,
		player.data.footDiameterY); //right foot

	fill(70, 90, 165);
	rect(
		player.xPos - player.data.legW - player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left upper leg

	fill(70, 90, 165);
	rect(
		player.xPos - 3 * player.data.legW / 2 - player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.legH + player.data.padding,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left lower leg

	fill(200, 0, 50);
	ellipse(
		player.xPos - player.data.legW /2,
		player.yPos - player.data.footDiameterY,
		2 * player.data.footDiameterX,
		player.data.footDiameterY); //right foot

	fill(224, 160, 0);
	rect(
		player.xPos - player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding,
		player.data.armW,
		player.data.armH,
		player.data.armRoundCorners); //right upper arm
	fill(0, 200, 255);
	rect(
		player.xPos + player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armH,
		player.data.armH,
		player.data.armW,
		player.data.armRoundCorners); //right lower arm
	fill(0, 200, 255);
	ellipse(
		player.xPos + 3 *player.data.padding + player.data.armH ,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armH,
		player.data.handDiameter,
		player.data.handDiameter); //left hand

}

function drawWalkingLeftCharacter(player){
	fill(0, 200, 255);
	ellipse(
		player.xPos + player.data.headCenterX,
		player.yPos + player.data.headCenterY,
		player.data.headDiameter,
		player.data.headDiameter); //head

	fill(255, 100, 0);
	rect(
		player.xPos - player.data.bodyW/2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding,
		player.data.bodyW,
		player.data.bodyH,
		player.data.bodyRoundCorners); //body

	fill(70, 90, 165);
	rect(
		player.xPos + player.data.legW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left upper leg

	fill(70, 90, 165);
	rect(
		player.xPos + player.data.legW,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.legH + player.data.padding,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left lower leg

	fill(200, 0, 50);
	ellipse(
		player.xPos + player.data.legW - player.data.footDiameterX + 4*player.data.padding,
		player.yPos - player.data.footDiameterY,
		2 * player.data.footDiameterX,
		player.data.footDiameterY); //right foot

	fill(70, 90, 165);
	rect(
		player.xPos - player.data.legW - player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left upper leg

	fill(70, 90, 165);
	rect(
		player.xPos - 3 * player.data.legW / 2 - player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.legH + player.data.padding,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left lower leg

	fill(200, 0, 50);
	ellipse(
		player.xPos - player.data.legW - player.data.footDiameterX ,
		player.yPos - player.data.footDiameterY,
		2 * player.data.footDiameterX,
		player.data.footDiameterY); //right foot

	fill(224, 160, 0);
	rect(
		player.xPos - player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding,
		player.data.armW,
		player.data.armH,
		player.data.armRoundCorners); //right upper arm
	fill(0, 200, 255);
	rect(
		player.xPos - player.data.armH - player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armH,
		player.data.armH,
		player.data.armW,
		player.data.armRoundCorners); //right l0wer arm
	fill(0, 200, 255);
	ellipse(
		player.xPos - 3 *player.data.padding - player.data.armH ,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armH,
		player.data.handDiameter,
		player.data.handDiameter); //left hand

}

function drawJumpingFrontCharacter(player){
	fill(0, 200, 255);
	ellipse(
		player.xPos + player.data.headCenterX,
		player.yPos + player.data.headCenterY,
		player.data.headDiameter,
		player.data.headDiameter); //head

	fill(255, 100, 0);
	rect(
		player.xPos - player.data.bodyW/2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding,
		player.data.bodyW,
		player.data.bodyH,
		player.data.bodyRoundCorners); //body

	fill(70, 90, 165);
	rect(
		player.xPos - player.data.bodyW / 2 - player.data.legH + player.data.legW,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding,
		player.data.legH,
		player.data.legW,
		player.data.legRoundCorners); //left upper leg

	fill(70, 90, 165);
	rect(
		player.xPos - player.data.bodyW / 2 - player.data.legH ,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.armW,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left lower leg

	fill(200, 0, 50);
	ellipse(
		player.xPos - player.data.bodyW / 2 - player.data.legH ,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.armW + player.data.legH + player.data.padding,
		player.data.footDiameterX,
		player.data.footDiameterY); //left foot

	fill(70, 90, 165);
	rect(
		player.xPos + 2 * player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding,
		player.data.legH,
		player.data.legW,
		player.data.legRoundCorners); //right upper leg

	fill(70, 90, 165);
	rect(
		player.xPos + player.data.legH + player.data.legW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.armW,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //right lower leg

	fill(200, 0, 50);
	ellipse(
		player.xPos + player.data.legH + player.data.legW + player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.armW + player.data.legH + player.data.padding,
		player.data.footDiameterX,
		player.data.footDiameterY); //right foot

	fill(224, 160, 0);
	rect(
		player.xPos - player.data.bodyW / 2 - player.data.padding - player.data.armH,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding,
		player.data.armH,
		player.data.armW,
		player.data.armRoundCorners); //left upper arm

	fill(0, 200, 255);
	rect(
		player.xPos - player.data.bodyW / 2 - player.data.padding - player.data.armH - player.data.armW,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armW,
		player.data.armW,
		player.data.armH,
		player.data.armRoundCorners); //left lower arm

	fill(0, 200, 255);
	ellipse(
		player.xPos - player.data.bodyW / 2 - player.data.armH - player.data.armW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armW + player.data.armH + 2 * player.data.padding,
		player.data.handDiameter,
		player.data.handDiameter); //left hand

	fill(224, 160, 0);
	rect(
		player.xPos + player.data.bodyW / 2 + player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding,
		player.data.armH,
		player.data.armW,
		player.data.armRoundCorners); //right upper arm

	fill(0, 200, 255);
	rect(
		player.xPos + player.data.bodyW / 2 + player.data.padding + player.data.armH,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armW,
		player.data.armW,
		player.data.armH,
		player.data.armRoundCorners); //right lower arm

	fill(0, 200, 255);
	ellipse(
		player.xPos + player.data.bodyW / 2 + player.data.padding + player.data.armH,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armW + player.data.armH + 2 * player.data.padding,
		player.data.handDiameter,
		player.data.handDiameter,
		player.data.handDiameter); //right hand

}

function drawJumpingRightCharacter(player){
	fill(224, 160, 0);
	rect(
		player.xPos  + player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding,
		player.data.armH,
		player.data.armW,
		player.data.armRoundCorners); //left upper arm

	fill(0, 200, 255);
	rect(
		player.xPos   + player.data.armH + player.data.armW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2  + player.data.armW - player.data.armH,
		player.data.armW,
		player.data.armH,
		player.data.armRoundCorners); //left lower arm

	fill(0, 200, 255);
	ellipse(
		player.xPos   + player.data.armH + player.data.armW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2  + player.data.armW - player.data.armH - 2* player.data.padding,
		player.data.handDiameter,
		player.data.handDiameter); //left hand


	fill(0, 200, 255);
	ellipse(
		player.xPos + player.data.headCenterX,
		player.yPos + player.data.headCenterY,
		player.data.headDiameter,
		player.data.headDiameter); //head

	fill(255, 100, 0);
	rect(
		player.xPos - player.data.bodyW/2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding,
		player.data.bodyW,
		player.data.bodyH,
		player.data.bodyRoundCorners); //body

	fill(224, 160, 0);
	rect(
		player.xPos - player.data.padding - player.data.armH,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding,
		player.data.armH,
		player.data.armW,
		player.data.armRoundCorners); //right upper arm

	fill(0, 200, 255);
	rect(
		player.xPos  - player.data.padding - player.data.armH - player.data.armW,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armW,
		player.data.armW,
		player.data.armH,
		player.data.armRoundCorners); //right lower arm

	fill(0, 200, 255);
	ellipse(
		player.xPos  - player.data.armH - player.data.armW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armW + player.data.armH + 2 * player.data.padding,
		player.data.handDiameter,
		player.data.handDiameter); //right hand

	fill(70, 90, 165);
	rect(
		player.xPos ,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding,
		player.data.legH,
		player.data.legW,
		player.data.legRoundCorners); //left upper leg

	fill(70, 90, 165);
	rect(
		player.xPos + player.data.legH,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.armW,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left lower leg

	fill(200, 0, 50);
	ellipse(
		player.xPos - player.data.footDiameterX + player.data.legH + 2*player.data.footDiameterX,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + 2 *player.data.padding + player.data.armW + player.data.legH,
		2 * player.data.footDiameterX,
		player.data.footDiameterY); //left foot

	fill(70, 90, 165);
	rect(
		player.xPos  - 3* player.data.legW/2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //right upper leg

	fill(70, 90, 165);
	rect(
		player.xPos - 3*player.data.legW/2 - player.data.legH,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.legH + player.data.padding,
		player.data.legH,
		player.data.legW,
		player.data.legRoundCorners); //right lower leg

	fill(200, 0, 50);
	ellipse(
		player.xPos - player.data.legW - player.data.legH,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.legH + player.data.padding + player.data.footDiameterX,
		player.data.footDiameterY,
		2 * player.data.footDiameterX
	); //right foot
}

function drawJumpingLeftCharacter(player){
	fill(224, 160, 0);
	rect(
		player.xPos  + player.data.padding,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding,
		player.data.armH,
		player.data.armW,
		player.data.armRoundCorners); //left upper arm

	fill(0, 200, 255);
	rect(
		player.xPos   + player.data.armH + player.data.armW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armW,
		player.data.armW,
		player.data.armH,
		player.data.armRoundCorners); //left lower arm

	fill(0, 200, 255);
	ellipse(
		player.xPos   + player.data.armH + player.data.armW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding + player.data.armW + player.data.armH + 2 * player.data.padding,
		player.data.handDiameter,
		player.data.handDiameter); //left hand



	fill(0, 200, 255);
	ellipse(
		player.xPos + player.data.headCenterX,
		player.yPos + player.data.headCenterY,
		player.data.headDiameter,
		player.data.headDiameter); //head

	fill(255, 100, 0);
	rect(
		player.xPos - player.data.bodyW/2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding,
		player.data.bodyW,
		player.data.bodyH,
		player.data.bodyRoundCorners); //body

	fill(224, 160, 0);
	rect(
		player.xPos  - player.data.padding - player.data.armH,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + 3* player.data.padding,
		player.data.armH,
		player.data.armW,
		player.data.armRoundCorners); //right upper arm

	fill(0, 200, 255);
	rect(
		player.xPos  - player.data.padding - player.data.armH - player.data.armW,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2  + player.data.armW - player.data.armH,
		player.data.armW,
		player.data.armH,
		player.data.armRoundCorners); //right lower arm

	fill(0, 200, 255);
	ellipse(
		player.xPos  - player.data.armH - player.data.armW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2  + player.data.armW - player.data.armH - 2* player.data.padding,
		player.data.handDiameter,
		player.data.handDiameter); //right hand

	fill(70, 90, 165);
	rect(
		player.xPos - player.data.legH - player.data.legW,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding,
		player.data.legH,
		player.data.legW,
		player.data.legRoundCorners); //left upper leg

	fill(70, 90, 165);
	rect(
		player.xPos - player.data.legH - 3* player.data.legW / 2,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.armW,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //left lower leg

	fill(200, 0, 50);
	ellipse(
		player.xPos - player.data.legH - player.data.legW / 2 - player.data.footDiameterX,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + 2 *player.data.padding + player.data.armW + player.data.legH,
		2 * player.data.footDiameterX,
		player.data.footDiameterY); //left foot

	fill(70, 90, 165);
	rect(
		player.xPos,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding,
		player.data.legW,
		player.data.legH,
		player.data.legRoundCorners); //right upper leg

	fill(70, 90, 165);
	rect(
		player.xPos + player.data.legW,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.legH + player.data.padding,
		player.data.legH,
		player.data.legW,
		player.data.legRoundCorners); //right lower leg

	fill(200, 0, 50);
	ellipse(
		player.xPos + player.data.legW + player.data.legH,
		player.yPos + player.data.headCenterY + player.data.headDiameter/2 + player.data.padding + player.data.bodyH + player.data.padding + player.data.legH + player.data.padding + player.data.footDiameterX,
		player.data.footDiameterY,
		2 * player.data.footDiameterX
	); //right foot
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds(clouds){
	// Draw clouds.
	for(var i = 0; i < clouds.length; i++){
		//Call the function that draws the clouds and pass the current object as input
		drawCloud(clouds[i]);
	}
}
function drawCloud(cloud){
	fill(255, 200, 230);
	rect(
		cloud.xPos - cloud.width/2,
		cloud.yPos,
		cloud.width,
		cloud.height * 0.2857); //base
	ellipse(
		cloud.xPos - cloud.width/2,
		cloud.yPos,
		cloud.width / 4,
		cloud.height * 0.5714); //first from left
	ellipse(
		cloud.xPos - cloud.width/4,
		cloud.yPos - cloud.height * 0.2857,
		cloud.width * 0.4375,
		cloud.height); //second from left
	ellipse(
		cloud.xPos,
		cloud.yPos - cloud.height * 0.1429,
		cloud.width * 0.3,
		cloud.height * 0.8571); //centre
	ellipse(
		cloud.xPos + cloud.width/4,
		cloud.yPos - cloud.height * 0.1429,
		cloud.width * 0.375,
		cloud.height * 0.8571); //second from right
	ellipse(
		cloud.xPos + cloud.width/2,
		cloud.yPos,
		cloud.width / 4,
		cloud.height * 0.5714); //first from right
}

// Function to draw mountains objects.
function drawMountains(mountains){
	// Draw mountains.
	for(var i = 0; i < mountains.length; i++){
		//Call the function that draws the mountains and pass the current object as input
		drawMountain(mountains[i]);
	}
}
function drawMountain(mountain){
	fill(117, 90, 80);
	stroke(65, 45, 40);

	//draw the body
	triangle(
		mountain.xPos - mountain.width / 2,
		mountain.yPos,
		mountain.xPos,
		mountain.yPos - mountain.height,
		mountain.xPos + mountain.width / 2,
		mountain.yPos);

	//draw the snow top of the mountain
	fill(255);
	noStroke();
	beginShape();

	vertex(
		mountain.xPos,
		mountain.yPos - mountain.height);
	vertex(
		mountain.xPos - mountain.width/2 * 0.328,
		mountain.yPos - mountain.height * 0.6767);
	vertex(
		mountain.xPos - mountain.width/2 * 0.28,
		mountain.yPos - mountain.height * 0.6983);
	vertex(
		mountain.xPos - mountain.width/2 * 0.2,
		mountain.yPos - mountain.height * 0.6552);
	vertex(
		mountain.xPos - mountain.width/2 * 0.04,
		mountain.yPos - mountain.height * 0.7414);
	vertex(
		mountain.xPos + mountain.width/2 * 0.12,
		mountain.yPos - mountain.height * 0.6552);
	vertex(
		mountain.xPos + mountain.width/2 * 0.2,
		mountain.yPos - mountain.height * 0.7414);
	vertex(
		mountain.xPos + mountain.width/2 * 0.328,
		mountain.yPos - mountain.height * 0.6767);

	endShape(CLOSE);
}

// Function to draw trees objects.
function drawTrees(trees){
	//Draw trees
	for(var i = 0; i < trees.length; i++){
		//prepare a tree object and pass it to the draw function
		var tree = {
			xPos: trees[i],
			yPos: floorPosY,
			width: 120,
			height: 300,
		};
		//Call the function that draws the trees and pass the current object as input
		drawTree(tree);
	}
}
function drawTree(tree){
	//variable containing construction data for the tree object
	const treeData =
		{
			trunkWidthRatio: 0.25,
			trunkHeightRatio: 0.3810,
			frond1WidthRatio: 0.25,
			frond1HeightRatio: 0.1429,
			frond1YRatio: -0.8571,
			frond2WidthRatio: 0.5,
			frond2HeightRatio: 0.1905,
			frond2YRatio: -0.7143,
			frond3WidthRatio: 0.75,
			frond3HeightRatio: 0.2381,
			frond3YRatio: -0.5476,
			frond4WidthRatio: 1,
			frond4HeightRatio: 0.2381,
			frond4YRatio: -0.3810
		};

	fill(140, 125, 120);
	//draw trunk
	rect(
		tree.xPos - tree.width / 2 * treeData.trunkWidthRatio,
		tree.yPos - tree.height * treeData.trunkHeightRatio,
		tree.width * treeData.trunkWidthRatio,
		tree.height * treeData.trunkHeightRatio);

	fill(0, 100, 0);

	//draw frond 1
	ellipse(
		tree.xPos,
		tree.yPos + tree.height * treeData.frond1YRatio,
		tree.width * treeData.frond1WidthRatio,
		tree.height * treeData.frond1HeightRatio);

	//draw frond 2
	ellipse(
		tree.xPos,
		tree.yPos + tree.height * treeData.frond2YRatio,
		tree.width * treeData.frond2WidthRatio,
		tree.height * treeData.frond2HeightRatio);

	//draw frond 3
	ellipse(
		tree.xPos,
		tree.yPos + tree.height * treeData.frond3YRatio,
		tree.width * treeData.frond3WidthRatio,
		tree.height * treeData.frond3HeightRatio);

	//draw frond 4
	ellipse(
		tree.xPos,
		tree.yPos + tree.height * treeData.frond4YRatio,
		tree.width * treeData.frond4WidthRatio,
		tree.height * treeData.frond4HeightRatio);
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyons(canyons){
	// Draw canyons
	for(var i = 0; i < canyons.length; i++){
		//Call the function that draws the canyons and pass the current object as input
		drawCanyon(canyons[i]);
		// checkCanyon(canyons[i]);
	}
}

function drawCanyon(canyon)
{
	fill(100, 85, 80);
	rect(canyon.xPos, canyon.yPos, canyon.width, canyon.height);
	fill(200, 200, 200);
	triangle(
		canyon.xPos + canyon.width/(canyon.spikeNum), //a=1
		canyon.yPos + canyon.height,
		canyon.xPos + (3 / 2) * canyon.width/(canyon.spikeNum),
		canyon.yPos + canyon.spikeH,
		canyon.xPos + 2 * canyon.width/canyon.spikeNum, //a=2
		canyon.yPos + canyon.height
	);
	triangle(
		canyon.xPos + 3 * canyon.width/(canyon.spikeNum), //a=3
		canyon.yPos + canyon.height,
		canyon.xPos + (7/2) * canyon.width/(canyon.spikeNum),
		canyon.yPos + canyon.spikeH,
		canyon.xPos + 4 * canyon.width/canyon.spikeNum, //a=4
		canyon.yPos + canyon.height
	);
	triangle(
		canyon.xPos + 5 * canyon.width/(canyon.spikeNum), //a=5
		canyon.yPos + canyon.height,
		canyon.xPos + (11/2) * canyon.width/(canyon.spikeNum),
		canyon.yPos + canyon.spikeH,
		canyon.xPos + 6 * canyon.width/canyon.spikeNum, //a=6
		canyon.yPos + canyon.height
	);
	triangle(
		canyon.xPos + 7 * canyon.width/(canyon.spikeNum), //a=7
		canyon.yPos + canyon.height,
		canyon.xPos + (15/2) * canyon.width/(canyon.spikeNum),
		canyon.yPos + canyon.spikeH,
		canyon.xPos + 8 * canyon.width/canyon.spikeNum, //a=8
		canyon.yPos + canyon.height
	);

}

// Function to check character is over a canyon.

function checkCanyons(canyons){

	for(var i = 0; i < canyons.length; i++){
		//Call the function that draws the canyons and pass the current object as input
		if(checkCanyon(canyons[i]))
			return canyons[i];
	}
}

function checkCanyon(canyon){
	if(gameCharWorldX >= canyon.xPos && gameCharWorldX <= (canyon.xPos + canyon.width )){
		return true;
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

function drawHud(){
	fill(255);
	textSize(24);
	textFont(hudFont);
	text('Score: ' + gameScore, 24, 24);

	//draw the player on the top right to count remaining lives
	var hudPlayer = {

		xPos: 0,
		yPos: 0,
		size: 0.5,
		speed: 5,
		ground: floorPosY, //New variable introduced to manage the depth of the canyon during the character fall.
		data: {
			headCenterX: 0,
			headCenterY: -65,
			headDiameter: 16,

			bodyW: 10,
			bodyH: 26,
			bodyRoundCorners: 3,

			legW: 3,
			legH:12,
			legRoundCorners: 1,

			footDiameterX: 4,
			footDiameterY: 2,

			armW: 3,
			armH: 12,
			armRoundCorners: 1,

			handDiameter: 3,

			padding: 1
		}
	};
	for(var i = 0; i < lives; i++){
		hudPlayer.yPos = 50;
		hudPlayer.xPos = width - 20 - i*20;
		drawFrontFacingCharacter(hudPlayer);
	}
}

function drawGameOver(){
	textSize(48);
	textFont(goFont);
	
	var title = 'GAME OVER!';
	var subtitle = 'Press space to continue.'
	
	fill(0,0,0, 128);
	rect((width - textWidth(subtitle))/2 - 48, height/3-56, textWidth(subtitle)+96, +160, 10);
	fill(255);
	text(title, (width - textWidth(title))/2, height/3);
	text(subtitle, (width - textWidth(subtitle))/2, height/3+ 80);

}

function drawLevelCompleted(){
	textSize(48);
	textFont(goFont);
	
	var title = 'LEVEL COMPLETED!';
	var subtitle = 'Press space to continue.'
	
	fill(0,0,0, 128);
	rect((width - textWidth(subtitle))/2 - 48, height/3-56, textWidth(subtitle)+96, +160, 10);
	fill(255);
	text(title, (width - textWidth(title))/2, height/3);
	text(subtitle, (width - textWidth(subtitle))/2, height/3+ 80);
}

function drawFlagpole(flagpole){

	var flagSize = 0.2;
	var baseWidth = 0.2;
	var baseHeight = 0.05;
	var poleWidth = 0.04;
	var poleHeight = 2;

	//draw pole
	fill(100);
	rect(
		flagpole.xPos - poleWidth/2 * flagpole.scale,
		floorPosY,
		poleWidth * flagpole.scale,
		- poleHeight * flagpole.scale)

	//draw basement
	fill(0, 100, 100);
	noStroke();
	rect(
		flagpole.xPos - baseWidth/2 * flagpole.scale ,
		floorPosY,
		baseWidth * flagpole.scale,
		-baseHeight * flagpole.scale);

	fill("red");
	if(flagpole.isReached){
		triangle(
			flagpole.xPos + (poleWidth* 3/4) * flagpole.scale,
			floorPosY + (flagSize - poleHeight) * flagpole.scale ,
			flagpole.xPos + (poleWidth* 3/4) * flagpole.scale,
			floorPosY - poleHeight * flagpole.scale,
			flagpole.xPos + ((poleWidth* 3/4) + flagSize )* flagpole.scale,
			floorPosY + (flagSize/2 - poleHeight) * flagpole.scale);
	}
	else{
		triangle(
			flagpole.xPos + (poleWidth* 3/4) * flagpole.scale,
			floorPosY -baseHeight * flagpole.scale,
			flagpole.xPos + (poleWidth* 3/4) * flagpole.scale,
			floorPosY - baseHeight * flagpole.scale - flagSize * flagpole.scale,
			flagpole.xPos + ((poleWidth* 3/4) + flagSize )* flagpole.scale,
			floorPosY -baseHeight * flagpole.scale - flagSize/2 * flagpole.scale);
	}
}

function checkFlagpole(flagpole){
	if(dist(flagpole.xPos, floorPosY, gameCharWorldX, player.yPos) < 20
		&& flagpole.isReached == false)
	{
		console.log("flagpole is Reached");
		flagpole.isReached = true;
	}
	return flagpole.isReached
}

function checkPlayerDie(){
	if(isPlummeting){
		lives--;
		if(lives>0)
			startGame();
	}
}

//this is the base object enemy
function enemy(x, y, range, size){
	this.x = x;
	this.y = y;
	this.range = range;
	this.size = size;
	this.currentX = x;
	this.inc = 1;
	this.colour1 = color(204, 170, 102);
	this.colour2 = color(155, 128, 75);

    this.draw = function(){
		this.update();
		push();
		translate(this.currentX, this.y);
		scale(-this.inc/abs(this.inc), 1);

		//draw snout
		stroke(0);
		strokeWeight(1);
		fill(this.colour1);
		beginShape();
		curveVertex(-0.311 * this.size, -0.317 * this.size);
		curveVertex(-0.311 * this.size, -0.317 * this.size);
		curveVertex(-0.412 * this.size, -0.301 * this.size);
		curveVertex(-0.466 * this.size, -0.217 * this.size);
		curveVertex(-0.428 * this.size, -0.160 * this.size);
		curveVertex(-0.374 * this.size, -0.110 * this.size);
		curveVertex(-0.219 * this.size, -0.052 * this.size);
		curveVertex(-0.133 * this.size, -0.050 * this.size);
		curveVertex(-0.076 * this.size, -0.071 * this.size);
		curveVertex(-0.110 * this.size, -0.285 * this.size);
		curveVertex(-0.231 * this.size, -0.369 * this.size);
		curveVertex(-0.311 * this.size, -0.317 * this.size);
		curveVertex(-0.286 * this.size, -0.348 * this.size);
		endShape();

		fill(this.colour2);

		//draw body
		beginShape();
		vertex(-0.346 * this.size, -0.302 * this.size);
		vertex(-0.385 * this.size, -0.331 * this.size);
		vertex(-0.335 * this.size, -0.351 * this.size);
		vertex(-0.378 * this.size, -0.385 * this.size);
		vertex(-0.324 * this.size, -0.400 * this.size);
		vertex(-0.360 * this.size, -0.436 * this.size);
		vertex(-0.303 * this.size, -0.439 * this.size);
		vertex(-0.338 * this.size, -0.479 * this.size);
		vertex(-0.275 * this.size, -0.475 * this.size);
		vertex(-0.303 * this.size, -0.518 * this.size);
		vertex(-0.241 * this.size, -0.508 * this.size);
		vertex(-0.260 * this.size, -0.553 * this.size);
		vertex(-0.201 * this.size, -0.537 * this.size);
		vertex(-0.212 * this.size, -0.585 * this.size);
		vertex(-0.157 * this.size, -0.560 * this.size);
		vertex(-0.158 * this.size, -0.609 * this.size);
		vertex(-0.107 * this.size, -0.579 * this.size);
		vertex(-0.101 * this.size, -0.628 * this.size);
		vertex(-0.055 * this.size, -0.594 * this.size);
		vertex(-0.041 * this.size, -0.641 * this.size);
		vertex(-0.001 * this.size, -0.603 * this.size);
		vertex( 0.023 * this.size, -0.648 * this.size);
		vertex( 0.054 * this.size, -0.606 * this.size);
		vertex( 0.085 * this.size, -0.648 * this.size);
		vertex( 0.109 * this.size, -0.603 * this.size);
		vertex( 0.148 * this.size, -0.642 * this.size);
		vertex( 0.163 * this.size, -0.594 * this.size);
		vertex( 0.209 * this.size, -0.629 * this.size);
		vertex( 0.215 * this.size, -0.580 * this.size);
		vertex( 0.265 * this.size, -0.609 * this.size);
		vertex( 0.264 * this.size, -0.560 * this.size);
		vertex( 0.320 * this.size, -0.587 * this.size);
		vertex( 0.309 * this.size, -0.537 * this.size);
		vertex( 0.369 * this.size, -0.558 * this.size);
		vertex( 0.349 * this.size, -0.509 * this.size);
		vertex( 0.410 * this.size, -0.522 * this.size);
		vertex( 0.383 * this.size, -0.475 * this.size);
		vertex( 0.442 * this.size, -0.483 * this.size);
		vertex( 0.411 * this.size, -0.439 * this.size);
		vertex( 0.473 * this.size, -0.440 * this.size);
		vertex( 0.431 * this.size, -0.400 * this.size);
		vertex( 0.491 * this.size, -0.392 * this.size);
		vertex( 0.445 * this.size, -0.359 * this.size);
		vertex( 0.500 * this.size, -0.343 * this.size);
		vertex( 0.449 * this.size, -0.315 * this.size);
		vertex( 0.500 * this.size, -0.295 * this.size);
		vertex( 0.449 * this.size, -0.271 * this.size);
		vertex( 0.493 * this.size, -0.247 * this.size);
		vertex( 0.438 * this.size, -0.229 * this.size);
		vertex( 0.479 * this.size, -0.198 * this.size);
		vertex( 0.422 * this.size, -0.188 * this.size);
		vertex( 0.455 * this.size, -0.152 * this.size);
		vertex( 0.397 * this.size, -0.150 * this.size);
		vertex( 0.426 * this.size, -0.114 * this.size);
		vertex( 0.377 * this.size, -0.118 * this.size);
		vertex( 0.399 * this.size, -0.076 * this.size);
		vertex( 0.351 * this.size, -0.083 * this.size);
		vertex( 0.360 * this.size, -0.044 * this.size);
		vertex( 0.314 * this.size, -0.064 * this.size);
		vertex( 0.306 * this.size, -0.020 * this.size);
		vertex( 0.271 * this.size, -0.055 * this.size);
		vertex( 0.252 * this.size, -0.012 * this.size);
		vertex( 0.225 * this.size, -0.040 * this.size);
		vertex( 0.204 * this.size, -0.003 * this.size);
		vertex( 0.176 * this.size, -0.037 * this.size);
		vertex( 0.125 * this.size,  0.003 * this.size);
		vertex( 0.127 * this.size, -0.034 * this.size);
		vertex( 0.101 * this.size,  0.004 * this.size);
		vertex( 0.078 * this.size, -0.030 * this.size);
		vertex( 0.050 * this.size,  0.004 * this.size);
		vertex( 0.033 * this.size, -0.031 * this.size);
		vertex(-0.002 * this.size,  0.005 * this.size);
		vertex(-0.007 * this.size, -0.040 * this.size);
		vertex(-0.046 * this.size, -0.007 * this.size);
		vertex(-0.045 * this.size, -0.053 * this.size);
		vertex(-0.099 * this.size, -0.032 * this.size);
		vertex(-0.076 * this.size, -0.071 * this.size);
		vertex(-0.122 * this.size, -0.081 * this.size);
		vertex(-0.081 * this.size, -0.111 * this.size);
		vertex(-0.134 * this.size, -0.121 * this.size);
		vertex(-0.101 * this.size, -0.147 * this.size);
		vertex(-0.145 * this.size, -0.168 * this.size);
		vertex(-0.099 * this.size, -0.189 * this.size);
		vertex(-0.147 * this.size, -0.209 * this.size);
		vertex(-0.100 * this.size, -0.238 * this.size);
		vertex(-0.156 * this.size, -0.250 * this.size);
		vertex(-0.110 * this.size, -0.285 * this.size);
		vertex(-0.172 * this.size, -0.283 * this.size);
		vertex(-0.144 * this.size, -0.327 * this.size);
		vertex(-0.201 * this.size, -0.309 * this.size);
		vertex(-0.189 * this.size, -0.353 * this.size);
		vertex(-0.241 * this.size, -0.327 * this.size);
		vertex(-0.231 * this.size, -0.369 * this.size);
		vertex(-0.276 * this.size, -0.347 * this.size);
		vertex(-0.311 * this.size, -0.317 * this.size);
		endShape();

		//draw eye
		fill(0);
		circle(-0.233 * this.size, -0.218 * this.size, 0.06 * this.size, 0.06 * this.size);

		//draw nose
		fill(0);
		circle(-0.45 * this.size, -0.266 * this.size, 0.1 * this.size, 0.1 * this.size);

		//draw ear
		noStroke();
		fill(96, 83, 57);
		beginShape();
		curveVertex(-0.145 * this.size, -0.347 * this.size);
		curveVertex(-0.156 * this.size, -0.352 * this.size);
		curveVertex(-0.139 * this.size, -0.390 * this.size);
		curveVertex(-0.116 * this.size, -0.413 * this.size);
		curveVertex(-0.080 * this.size, -0.427 * this.size);
		curveVertex(-0.046 * this.size, -0.420 * this.size);
		curveVertex(-0.004 * this.size, -0.378 * this.size);
		curveVertex(-0.001 * this.size, -0.342 * this.size);
		curveVertex(-0.065 * this.size, -0.289 * this.size);
		curveVertex(-0.086 * this.size, -0.284 * this.size);
		curveVertex(-0.095 * this.size, -0.308 * this.size);
		curveVertex(-0.133 * this.size, -0.344 * this.size);
		curveVertex(-0.145 * this.size, -0.347 * this.size);
		endShape();

		fill(48, 41, 29);
		beginShape()
		curveVertex(-0.147 * this.size, -0.352 * this.size);
		curveVertex(-0.117 * this.size, -0.392 * this.size);
		curveVertex(-0.087 * this.size, -0.404 * this.size);
		curveVertex(-0.044 * this.size, -0.388 * this.size);
		curveVertex(-0.027 * this.size, -0.337 * this.size);
		curveVertex(-0.061 * this.size, -0.306 * this.size);
		curveVertex(-0.088 * this.size, -0.291 * this.size);
		endShape();

		stroke(0);
		strokeWeight(5);
		pop();
	};

    this.checkContact = function(gc_x, gc_y){
        var d = dist(gc_x, gc_y, this.currentX, this.y);

        if(d < size / 2){
            return true;
        }
        return false;
    };

    this.update = function(){
        this.currentX += this.inc;

        if(this.currentX >= this.x + this.range){
            this.inc = -1;
        } else if(this.currentX < this.x){
            this.inc = 1;
        }
    };

}

//this function specializes the enemy, in order to reuse the common characteristics
//like inheritance
function boss(x, y, range, size){
    enemy.call(this, x, y, range, size);
    this.colour1 = color(82, 20, 46);
	this.colour2 = color(45, 51, 14);

	//I could rewrite the draw function if I wanted the enemy to look differente from the base one
    // this.draw = function(){
    // }

	//or the checkContact function
	// this.checkContact = function(gc_x, gc_y){
	// };
}

function collectable(x, y, size, typeIndex){
	this.x = x;
	this.y = y;
	this.size = size;
	this.typeIndex = typeIndex;
	this.isFound = false;

	//various types of collectables
	this.types = [
		{colour: color("white"), score: 10},
		{colour: color("red"), score: 8},
		{colour: color("orange"), score: 6},
		{colour: color("yellow"), score: 4},
		{colour: color("green"), score: 2},
		{colour: color("blue"), score:1}
	];

	this.colour = this.types[typeIndex].colour;
	this.score = this.types[typeIndex].score;

	this.draw = function(){
		if(this.isFound)
			return;

		//takes the initial colour, and calulates four different shades for the faces of the stones
		//use HSL because it makes easier to calculate shades of the same hue
		colorMode(HSL, 255);

		var darkestHue = color(hue(this.colour), saturation(this.colour), 64);
		var darkerHue = color(hue(this.colour), saturation(this.colour), 128);
		var lighterHue = color(hue(this.colour), saturation(this.colour), 160);
		var lightestHue =  color(hue(this.colour), saturation(this.colour), 192);

		//back to RGB
		colorMode(RGB, 255);

		stroke(192);

		//this function draws only the right half of the object
		//the left half is drawn applying a matrix that mirrors the x and recalling the same function.
		var drawHalf = function(scaleFactor, centerColour, sideColour){
			fill(centerColour);

			//central triangle
			triangle(
				0 * scaleFactor,
				0 * scaleFactor,
				0.3 * scaleFactor,
				-0.8 * scaleFactor,
				0 * scaleFactor,
				-0.8 * scaleFactor);

			//central quadrangle
			quad(
				0 * scaleFactor,
				-0.8 * scaleFactor,
				0.3 * scaleFactor,
				-0.8 * scaleFactor,
				0.2 * scaleFactor,
				-1 * scaleFactor,
				0 * scaleFactor,
				-1 * scaleFactor
			);

			fill(sideColour);

			//side triangle
			triangle(
				0 * scaleFactor,
				0 * scaleFactor,
				0.5 * scaleFactor,
				-0.8 * scaleFactor,
				0.3 * scaleFactor,
				-0.8 * scaleFactor);

			//side quadrangle
			quad(
				0.5 * scaleFactor,
				-0.8 * scaleFactor,
				0.3 * scaleFactor,
				-1 * scaleFactor,
				0.2 * scaleFactor,
				-1 * scaleFactor,
				0.3 * scaleFactor,
				-0.8 * scaleFactor
			);
		}

		push();
		//translate the origin to the point where object must be drawn
		translate(this.x, this.y);
		//draw the right half
		drawHalf(size, darkerHue, darkestHue)
		//mirror the x
		applyMatrix(-1, 0, 0, 1, 0, 0);
		//draw the left half
		drawHalf(size, lighterHue, lightestHue);
		pop();
	}

	this.checkContact = function(gc_x, gc_y){
		if(this.isFound)
			return false;

		var d = dist(gc_x, gc_y, this.x, this.y);

		if(d < size){
			this.isFound = true
			return true;
		}
		return false;
	};
}

//platforms are made of blocks
function createPlatform(x, y, numOfBlocks){
	var blockSize = 20;
	var p = {
		x: x,
		y: y,
		length: numOfBlocks * blockSize,
		numOfBlocks: numOfBlocks,

		draw: function(){
			var tileSize = 20;
			fill(128, 50, 50);
			stroke(80, 25, 25);
			square(this.x, this.y, tileSize, tileSize / 5, 0, 0, tileSize / 5);
			for(var i = 0; i < numOfBlocks - 2; i++){
				square(this.x + tileSize * (i+1), this.y, tileSize);
			}
			square(this.x + tileSize * (numOfBlocks - 1), this.y, tileSize, 0, tileSize / 5, tileSize / 5, 0);
			// rect(this.x, this.y, this.numOfBlocks * tileSize, 20);
		},
		checkContact: function (x, y) {
			if(x > this.x && x < this.x + this.length){
				var d = this.y - y;
				if(d >= 0){
					console.log("on platform");
					return true;
				}
			}else{
				console.log("off platform");
			}
			return false;
		}
	}
	return p;
}

function checkPlatforms(platforms){
	for(var i = 0; i < platforms.length; i++){
		//Call the function that draws the canyons and pass the current object as input
		if(platforms[i].checkContact(gameCharWorldX, player.yPos))
			return platforms[i];
	}
}
