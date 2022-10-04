/*
My exstentions ->
	I did not add to much extensions to the project only sounds (game over , coin collected and jump sound)
	I also added a font for the completed and game over texts to give it a bit more styling

	
Diffucult parts -> 
	I have an strong functional programming background as i am already an active developer. 
	But learning javascript was a very fun experience and has always been one of my top todo's.

	I currently develop in F# were we use the fable library to compile our F# code to Javascript
	for out front end application, this has helped me alot to understand were i can step up my front end 
	developement in F# .

What i have learned -> 
	That programming does not matter what language you use to get the job done , but rather the journey 
	that takes place while I struggle with bugs no matter how small or big, I am extreamly exited for 
	the rest of my coding journey and cant wait to take one more difficult problems
	
*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var trees_x;
var treePos_y;
var collectables;
var canyons;
var mountains;
var clouds;
var flagpole;
var game_lives;
var game_score;
var game_over;
var game_completed;
var jumpSound;
var coinSound;
var failSound;
var gameFont;

function preload(){
	soundFormats('mp3', 'wav');
	jumpSound = loadSound('assets/jump.wav');
	jumpSound.setVolume(0.1);

	coinSound = loadSound('assets/coin.mp3');
	coinSound.setVolume(0.1);

	failSound = loadSound('assets/fail.mp3');
	failSound.setVolume(0.1);

	gameFont = loadFont('assets/game_font.otf')

}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    game_lives = 3;
    game_over = false;
	scrollPos = 0;
    game_score = 0;
	gameChar_world_x = gameChar_x - scrollPos;
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	treePos_y = height / 2 -5;
	trees_x = [ 100,500,800,1100,1500,1800 ];

	clouds = [ 
		{ x_pos : 100 , y_pos : 150, size : 60 },
		{ x_pos : 260 , y_pos : 50 , size : 60 },
		{ x_pos : 650 , y_pos : 120, size : 60 },
		{ x_pos : 800 , y_pos : 70 , size : 60 },
		{ x_pos : 1100, y_pos : 150, size : 60 },
		{ x_pos : 1260, y_pos : 50 , size : 60 },
		{ x_pos : 1650, y_pos : 120, size : 60 },
		{ x_pos : 1900, y_pos : 70 , size : 60 }
	];

	mountains = [
		{ x_pos : 225  , y_pos : 432},
		{ x_pos : 1225 , y_pos : 432},
	]

	collectables = [
		{ x_pos : 100 , y_pos : 400, size : 30, collected : false },
		{ x_pos : 750 , y_pos : 400, size : 30, collected : false },
		{ x_pos : 1000, y_pos : 400, size : 30, collected : false },
		{ x_pos : 1500, y_pos : 400, size : 30, collected : false }
	]

	canyons = [
		{ x_pos : 250 , y_pos : 432},
		{ x_pos : 1250, y_pos : 432}
	]
    
    flagpole = {isReached : false, x_pos : 1500};

}
function draw(){
    if (game_over){

		render();
		textFont(gameFont);
		fill(125,30,130).textSize(40);
        text("GAME OVER" , width/2 - 100,height/2 );
		textFont('Georgia');
		
    }
    else if (game_completed){

		render();		
		textFont(gameFont);
		fill(125,30,130).textSize(40);
        text("COMPLETED" , width/2 - 100,height/2 );
		textFont('Georgia');

    }
    else {

        render();

    }
}

function render()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
	
	push();
	translate(scrollPos, 0);

	// Draw clouds.
	drawClouds();
	// Draw mountains.
	drawMountains();
	// Draw trees.
	drawTrees();
	// Draw canyons.
	for (var i = 0; i < canyons.length; i++){
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}
	// Draw collectable items.
	for (var i = 0; i < collectables.length; i++){
		drawCollectable(collectables[i]);
		checkCollectable(collectables[i]);
	}
    renderFlagpole();
    checkFlagpole();

	// Draw game character.
	pop();
	
    fill(0);
    text("💲 : "+game_score+"",20,20);
    text("❤️ : "+game_lives+"" , 20,40);
    
    drawGameChar();
    

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
	
	// Logic to make the game character rise and fall.
    checkRemainingLives();
    
    if (isPlummeting) {
        gameChar_y += 5;
        checkGameCharY();
    }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
	
	checkGameCompletion();
    
  }


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
	if(!game_over && !game_completed){

		if (keyCode == 39)
		{
			isRight = true;
		}
		else if (keyCode == 37) 
		{
			isLeft = true;
		}
		else if (keyCode == 38)
		{
			isFalling = true;
			jumpSound.play();
			gameChar_y -= 20;
		}
		else if (keyCode == 37 && keyCode == 38)
		{
			isFalling = true;
			isLeft = true;
		}
		else if (keyCode == 39 && keyCode == 38 )
		{
			isFalling = true;
			isRight = true;
		}
	}

}

function keyReleased()
{
		if (keyCode == 39) 
		{
			isRight = false;
		}
		else if (keyCode == 37)
		{
			isLeft = false;
		}
		else if (keyCode == 38)
		{
			isFalling = false;
			gameChar_y = floorPos_y;
		}
		else if (keyCode == 37 && keyCode == 38)
		{	
			if (!isPlummeting){
				isFalling = false;
				isLeft = false;
			}

		}
		else if (keyCode == 39 && keyCode == 38 )
		{
			isFalling = false;
			isRight = false;
		}

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling){
		// Jumping left 
		//Head
		fill(180,100,125);
		ellipse(gameChar_x, gameChar_y-60,15,25);
		//Body
		fill(100,170,0);
		rect (gameChar_x-7.5, gameChar_y-50, 15,25);
		//arms
		fill (100,150,25);
		rect(gameChar_x - 3 ,gameChar_y - 60 ,5,15);
		// hands
		fill(180,100,150);
		rect(gameChar_x - 3 ,gameChar_y - 70 ,5,5);
		//legs
		fill(0,0,255);
		rect (gameChar_x -5, gameChar_y - 25, 10, 15);
		//feet
		fill(0);
		rect (gameChar_x -5, gameChar_y -15, 10, 5);
	}
	else if(isRight && isFalling){
		//Jumping right 
		//Head
		fill(180,100,125);
		ellipse(gameChar_x, gameChar_y-60,15,25);
		//Body
		fill(100,170,0);
		rect (gameChar_x-7.5, gameChar_y-50, 15,25);
		//arms
		fill (100,150,25);
		rect(gameChar_x - 2 ,gameChar_y - 60 ,5,15);
		// hands
		fill(180,100,150);
		rect(gameChar_x - 2 ,gameChar_y - 70 ,5,5);
		//legs
		fill(0,0,255);
		rect (gameChar_x -5, gameChar_y - 25, 10, 15);
		//feet
		fill(0);
		rect (gameChar_x -5, gameChar_y -15, 10, 5);
	}
	else if(isLeft){
		// add your walking left code
		fill(180,100,125);
    	ellipse(gameChar_x, gameChar_y-60,15,25);
    	//Body
    	fill(100,170,0);
    	rect (gameChar_x-7.5, gameChar_y-50, 15,25);
    	//arms
    	fill (100,150,25);
    	rect(gameChar_x - 3 ,gameChar_y - 45 ,5,15);
    	// hands
    	fill(180,100,125);
    	rect(gameChar_x - 3 ,gameChar_y - 30 ,5,5);
    	//legs
    	fill(0,0,255);
    	rect (gameChar_x -5, gameChar_y - 25, 10, 25);
    	//feet
    	fill(0);
    	rect (gameChar_x -5, gameChar_y -5, 10, 5);
	}
	else if(isRight){
		//Walking right
		//Head
		fill(180,100,125);
		ellipse(gameChar_x, gameChar_y-60,15,25);
		//Body
		fill(100,170,0);
		rect (gameChar_x-7.5, gameChar_y-50, 15,25);
		//arms
		fill (100,150,25);
		rect(gameChar_x - 2 ,gameChar_y - 45 ,5,15);
		// hands
		fill(180,100,125);
		rect(gameChar_x - 2 ,gameChar_y - 30 ,5,5);
		//legs
		fill(0,0,255);
		rect (gameChar_x -5, gameChar_y - 25, 10, 25);
		//feet
		fill(0);
		rect (gameChar_x -5, gameChar_y -5, 10, 5);
	}
	else if(isFalling || isPlummeting){
		//Jumping facing forwards
		//Head
		fill(180,100,125);
		ellipse(gameChar_x, gameChar_y-60,25,25);
		//Body
		fill(100,170,0);
		rect (gameChar_x-12.5, gameChar_y-50, 25,25);
		fill (100,150,25);
		rect(gameChar_x - 17 ,gameChar_y - 60 ,5,15);
		rect(gameChar_x + 12 ,gameChar_y - 60 ,5,15);
		// hands
		fill(180,100,125);
		rect(gameChar_x - 17 ,gameChar_y - 65 ,5,5);
		rect(gameChar_x + 12 ,gameChar_y - 65 ,5,5);
		//legs
		fill(0,0,255);
		rect (gameChar_x -11, gameChar_y - 25, 10, 15);
		rect (gameChar_x +1, gameChar_y - 25, 10, 15);
		//feet
		fill(0);
		rect (gameChar_x - 11, gameChar_y -15 , 10, 5);
		rect (gameChar_x +1, gameChar_y -15, 10, 5);
	}
	else {
		//standing front facing
		//Head
		fill(180,100,125);
		ellipse(gameChar_x, gameChar_y-60,25,25);
		//Body
		fill(100,170,0);
		rect (gameChar_x-12.5, gameChar_y-50, 25,25);
		//arms
		fill (100,150,25);
		rect(gameChar_x - 17 ,gameChar_y - 50 ,5,15);
		rect(gameChar_x + 12 ,gameChar_y - 50 ,5,15);
		// hands
		fill(180,100,125);
		rect(gameChar_x - 17 ,gameChar_y - 35 ,5,5);
		rect(gameChar_x + 12 ,gameChar_y - 35 ,5,5);
		//legs
		fill(0,0,255);
		rect (gameChar_x -11, gameChar_y - 25, 10, 25);
		rect (gameChar_x +1, gameChar_y - 25, 10, 25);
		//feet
		fill(0);
		rect (gameChar_x - 11, gameChar_y -5 , 10, 5);
		rect (gameChar_x +1, gameChar_y -5, 10, 5);
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds(){
	for (var i = 0; i < clouds.length ; i++){
		fill(255);
    	ellipse(clouds[i].x_pos     ,clouds[i].y_pos,clouds[i].size     ,clouds[i].size);
    	ellipse(clouds[i].x_pos + 40,clouds[i].y_pos,clouds[i].size + 20,clouds[i].size + 20);
		ellipse(clouds[i].x_pos + 80,clouds[i].y_pos,clouds[i].size     ,clouds[i].size);
	}
}

// Function to draw mountains objects.
function drawMountains(){
	for (var i = 0; i < mountains.length; i++){
		fill(120,50,15);
    	triangle(mountains[i].x_pos      ,mountains[i].y_pos,
				 mountains[i].x_pos + 250,mountains[i].y_pos,
				 mountains[i].x_pos + 75 ,mountains[i].y_pos - 132);

    	triangle(mountains[i].x_pos + 100,mountains[i].y_pos,
			     mountains[i].x_pos + 250,mountains[i].y_pos,
				 mountains[i].x_pos + 175,mountains[i].y_pos - 132);

    	triangle(mountains[i].x_pos + 100,mountains[i].y_pos,
			     mountains[i].x_pos + 350,mountains[i].y_pos,
				 mountains[i].x_pos + 275,mountains[i].y_pos - 132);
	}
}

// Function to draw trees objects.

function drawTrees() {

	for (var i = 0 ; i < trees_x.length ; i++) {
		fill(120,100,40);
    	rect(trees_x[i],treePos_y,60,150);
    	//Branches
    	fill(0,155,0);
    	triangle(trees_x[i] - 50,treePos_y + 50,trees_x[i] + 30,treePos_y - 50 ,trees_x[i] + 110,treePos_y + 50);
    	triangle(trees_x[i] - 50,treePos_y     ,trees_x[i] + 30,treePos_y - 100,trees_x[i] + 110,treePos_y);
    	triangle(trees_x[i] - 50,treePos_y - 50,trees_x[i] + 30,treePos_y - 160,trees_x[i] + 110,treePos_y - 50);
	}
	
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{	
	fill(31,144,255);
	rect(t_canyon.x_pos,t_canyon.y_pos, 100, 150);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	if (gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + 100 && !isFalling){
        isPlummeting = true ;
    }
}

// --------------------------------------------
// Collectable items render and check functions
// --------------------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{

	if(! t_collectable.collected){

		stroke(250,225,0);
    	strokeWeight(4);
    	fill(255,255,0);
    	ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size,t_collectable.size);
    	fill(0);
		text("$",t_collectable.x_pos - 4,t_collectable.y_pos + 5); 
    	noStroke();
	}
	
}

function checkGameCompletion (){
	if (game_score == 4 && flagpole.isReached){
		game_completed = true;
	}
}

function checkCollectable(t_collectable)
{
	var distanceBetweenCoin = dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos);
	if (distanceBetweenCoin < 35 && t_collectable.collected != true)
	{
		t_collectable.collected = true;
        game_score += 1;
		coinSound.play();
	}
	
}

function renderFlagpole(){
    strokeWeight(5);
    stroke(125,125,125);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y -250);
    noStroke();
    fill(125,0,45);
    if (flagpole.isReached){
        rect(flagpole.x_pos, floorPos_y - 250, 75, 50);
    }
    else {
        rect(flagpole.x_pos, floorPos_y - 50, 75,50);
    }
}

function checkFlagpole(){
    d = dist(flagpole.x_pos,floorPos_y, gameChar_world_x, gameChar_y);
    if (d < 5 && game_score == 4){
        flagpole.isReached = true;
    }
}

function checkGameCharY(){
    if (gameChar_y > 600 ){
        isPlummeting = false;
        gameChar_y = floorPos_y;
        gameChar_x = width / 2;
        game_lives -= 1;
    }
}

function checkRemainingLives(){
    if (game_lives <= 0){
        game_over = true;
		failSound.play();
    }
}