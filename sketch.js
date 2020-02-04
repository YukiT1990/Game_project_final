/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


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

var clouds;
var mountains;

var trees_x;
var treePos_y;
var repeatX;

var canyons;
var collectables;

var game_score;
var flagpole;

var lives;
var isDied;
var isGameover;


var jumpSound;
var itemIsCollectedSound;
var plummetingSound;
var gameoverSound;
var levelCompletedSound;
var errorSound;

var platforms;
var canJumpAgain;

var enemies;


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    itemIsCollectedSound = loadSound('assets/itemIsCollectedSound.wav');
    itemIsCollectedSound.setVolume(0.3);
    
    plummetingSound = loadSound('assets/plummeting.wav');
    plummetingSound.setVolume(0.05);
    
    gameoverSound = loadSound('assets/gameover.wav');
    gameoverSound.setVolume(0.5);
    
    levelCompletedSound = loadSound('assets/levelCompleted.mp3');
    levelCompletedSound.setVolume(0.5);
    
    errorSound = loadSound('assets/error.wav');
    errorSound.setVolume(0.05);
}


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    
	startGame();
    

}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    treePos_y = height/2 - 5;
    repeatX = width;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isDied = false;
    isGameover = false;
    canJumpAgain = false;

	// Initialise arrays of scenery objects.
    
    trees_x = [
        100, 300, 500, 1000, 
        100 + repeatX, 300 + repeatX, 500 + repeatX, 1000 + repeatX, 
        100 + repeatX * 2, 300 + repeatX * 2, 500 + repeatX * 2, 1000 + repeatX * 2
    ];
    
    clouds = [
        {x_pos: 350, y_pos: 100, size: 12},
        {x_pos: 650, y_pos: 150, size: 10},
        {x_pos: 850, y_pos: 100, size: 8}, 
        {x_pos: repeatX + 350, y_pos: 100, size: 12},
        {x_pos: repeatX + 650, y_pos: 150, size: 10},
        {x_pos: repeatX + 850, y_pos: 100, size: 8}, 
        {x_pos: repeatX * 2 + 350, y_pos: 100, size: 12},
        {x_pos: repeatX * 2 + 650, y_pos: 150, size: 10},
        {x_pos: repeatX * 2 + 850, y_pos: 100, size: 8}
    ];
    
    mountains = [
        {x_pos: 0, y_pos: floorPos_y, size: 10},
        {x_pos: -30, y_pos: floorPos_y, size: 6},
        {x_pos: 250, y_pos: floorPos_y, size: 8},
        {x_pos: repeatX + 0, y_pos: floorPos_y, size: 10},
        {x_pos: repeatX - 30, y_pos: floorPos_y, size: 6},
        {x_pos: repeatX + 250, y_pos: floorPos_y, size: 8},
        {x_pos: repeatX * 2 + 0, y_pos: floorPos_y, size: 10},
        {x_pos: repeatX * 2 - 30, y_pos: floorPos_y, size: 6},
        {x_pos: repeatX * 2 + 250, y_pos: floorPos_y, size: 8}
    ];
    
    canyons = [
        {x_pos: 600, width: 50},
        {x_pos: 900, width: 50},
        {x_pos: repeatX + 600, width: 50},
        {x_pos: repeatX + 900, width: 50}, 
        {x_pos: repeatX * 2 + 600, width: 50},
        {x_pos: repeatX * 2 + 900, width: 50}
    ];
    
    collectables = [
        {x_pos: 800, y_pos: 400, size: 50, isFound: false},
        {x_pos: 100, y_pos: 200, size: 70, isFound: false},
        {x_pos: repeatX + 800, y_pos: 400, size: 50, isFound: false},
        {x_pos: repeatX + 100, y_pos: 200, size: 70, isFound: false},
        {x_pos: repeatX * 2 + 800, y_pos: 400, size: 50, isFound: false},
        {x_pos: repeatX * 2 + 100, y_pos: 200, size: 70, isFound: false}
    ];
    
    platforms = [];
    
    platforms.push(createPlatforms(100, floorPos_y - 136, 120));
    platforms.push(createPlatforms(repeatX + 100, floorPos_y - 136, 120));
    platforms.push(createPlatforms(repeatX * 2 + 100, floorPos_y - 136, 120));
    
    game_score = 0;
    
    flagpole = {isReached: false, x_pos: width * 3 + 100};
    
    enemies = [];
    enemies.push(new Enemy(120, floorPos_y - 10, 150));
    enemies.push(new Enemy(repeatX + 120, floorPos_y - 10, 150));
    enemies.push(new Enemy(repeatX * 2 + 120, floorPos_y - 10, 150));
}

function draw()
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
    
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
        if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == false && canJumpAgain == true && gameChar_y == floorPos_y)
        {
            canJumpAgain = false;
        }
    }
    

	// Draw canyons.
    for (var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

	// Draw collectable items.
    for (var i = 0; i < collectables.length; i++)
    {
        if (collectables[i].isFound == false)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    
    renderFlagpole();
    
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact == true)
        {
            if(lives > 0)
            {
                errorSound.play();
                lives--;
                startGame();
                break;
            }
        }
    }
    
    
    pop();

	// Draw game character.
	if(lives > 0){
        drawGameChar();
    }
	
    
    // Show score and lives
    
    textSize(30);
    fill(255);
    noStroke();
    text("score: " + game_score, 30, 30);
    fill(200);
    text("lives: ", 30, 60);
    for(var i = 0; i < lives; i++)
    {
        fill(240, 0, 0);
        ellipse(118 + i * 40, 46, 16, 16);
        ellipse(118 + 15 + i * 40, 46, 16, 16);
        triangle(109 + i * 40, 46, 142 + i * 40, 46, 125 + i * 40, 68);
    }
    
    if(lives < 1){
        plummetingSound.pause();
        fill(255);
        strokeWeight(10);
        stroke(255, 204, 0);
        rect(width/4 - 50, height *3 /8, width/2 + 50, height/4);
        textSize(30);
        fill(0);
        noStroke();
        text("Game over. Press space to continue.", width/4 - 40, height/2);
        
        return;
    }
    
    
    if(flagpole.isReached == true)
    {
        fill(255);
        strokeWeight(10);
        stroke(255, 204, 0);
        rect(width/4 - 100, height *3 /8, width/2 + 120, height/4);
        textSize(30);
        fill(0);
        noStroke();
        text("Level complete. Press space to continue.", width/4 - 90, height/2);
        gameChar_y = floorPos_y;
        isFalling = false;
        
        return;
    }

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
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    
    if (gameChar_y < floorPos_y) 
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                gameChar_y = platforms[i].y;
                isFalling = false;
                break;
            }
        }
        if(isContact == false){
            gameChar_y += 2;
            isFalling = true;
        }
        
        
    } else {
        isFalling = false;
    }
    
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    if(isDied == false)
    {
        checkPlayerDie();
        if(isDied == true)
        {
            lives -= 1;
        }
        if((isGameover == false) && (gameChar_y >= height)) {
            startGame();
        }
    }
    
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

    //left arrow is keyCode == 37
    if (keyCode == 37) {
        isLeft = true;
    }
    
    //right arrow is keyCode == 39
    if (keyCode == 39) {
        isRight = true;
    }
    
    //space key is keyCode == 32
    if (keyCode == 32 && gameChar_y == floorPos_y) {
        gameChar_y -= 136;
        jumpSound.play();
    }
    
    for(var i = 0; i < platforms.length; i++)
    {
        if(keyCode == 32 && gameChar_y == platforms[i].y 
           && platforms[i].checkContact(gameChar_world_x, gameChar_y) == true 
           && canJumpAgain == true)
        {
            gameChar_y -= 136;
            jumpSound.play();
        }
    }
    


}

function keyReleased()
{

    
    if (keyCode == 37) {
        isLeft = false;
    }
    
    if (keyCode == 39) {
        isRight = false;
    }
    
    for(var i = 0; i < platforms.length; i++)
    {
        if(keyCode == 32 && gameChar_y == platforms[i].y && platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
        {
            canJumpAgain = true;
        }
    }
    

    
    if ((keyCode == 37 || keyCode == 39) && lives == 0) {
        gameoverSound.play();
    }
    
    if ((keyCode == 37 || keyCode == 39) && flagpole.isReached == true) {
        levelCompletedSound.play();
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        
        //legs
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 16, 20, 10);
        //left arm
        stroke(255, 230, 204);
        strokeWeight(4);
        line(gameChar_x - 13, gameChar_y - 45, gameChar_x - 17, gameChar_y - 60);
        //body
        noStroke();
        fill(255, 102, 255);
        rect(gameChar_x - 15, gameChar_y -50, 30, 30, 4);
        //head
        fill(255, 230, 204);
        ellipse(gameChar_x, gameChar_y - 60, 25, 25);
        //right arm
        stroke(255, 230, 204);
        strokeWeight(4);
        line(gameChar_x + 13, gameChar_y - 45, gameChar_x + 17, gameChar_y - 60);
        //eyes
        noStroke();
        fill(0);
        rect(gameChar_x - 6, gameChar_y - 63, 3, 5);
        //legs
        ellipse(gameChar_x - 10, gameChar_y - 20, 20, 10);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        
        //legs
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 16, 20, 10);
        //right arm
        stroke(255, 230, 204);
        strokeWeight(4);
        line(gameChar_x + 13, gameChar_y - 45, gameChar_x + 17, gameChar_y - 60);
        //body
        noStroke();
        fill(255, 102, 255);
        rect(gameChar_x - 15, gameChar_y -50, 30, 30, 4);
        //head
        fill(255, 230, 204);
        ellipse(gameChar_x, gameChar_y - 60, 25, 25);
        //left arm
        stroke(255, 230, 204);
        strokeWeight(4);
        line(gameChar_x - 13, gameChar_y - 45, gameChar_x - 17, gameChar_y - 60);
        //eyes
        noStroke();
        fill(0);
        rect(gameChar_x + 6, gameChar_y - 63, 3, 5);
        //legs
        ellipse(gameChar_x + 10, gameChar_y - 20, 20, 10);

	}
	else if(isLeft)
	{
		// add your walking left code
        
        //legs
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 1, 20, 10);
        //body
        fill(255, 102, 255);
        rect(gameChar_x - 15, gameChar_y -50, 30, 45, 4);
        //head
        fill(255, 230, 204);
        ellipse(gameChar_x, gameChar_y - 60, 25, 25);
        //eyes
        fill(0);
        rect(gameChar_x - 6, gameChar_y - 63, 3, 5);
        //legs
        ellipse(gameChar_x - 10, gameChar_y - 5, 20, 10);

	}
	else if(isRight)
	{
		// add your walking right code
        
        //legs
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 1, 20, 10);
        //body
        fill(255, 102, 255);
        rect(gameChar_x - 15, gameChar_y -50, 30, 45, 4);
        //head
        fill(255, 230, 204);
        ellipse(gameChar_x, gameChar_y - 60, 25, 25);
        //eyes
        fill(0);
        rect(gameChar_x + 6, gameChar_y - 63, 3, 5);
        //legs
        ellipse(gameChar_x + 10, gameChar_y - 5, 20, 10);


	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        
        //legs
        fill(0);
        ellipse(gameChar_x - 9, gameChar_y - 16, 10, 10);
        ellipse(gameChar_x + 9, gameChar_y - 16, 10, 10);
        //body
        fill(255, 102, 255);
        rect(gameChar_x - 15, gameChar_y -50, 30, 30, 4);
        //head
        fill(255, 230, 204);
        ellipse(gameChar_x, gameChar_y - 60, 25, 25);
        //arms
        stroke(255, 230, 204);
        strokeWeight(4);
        line(gameChar_x - 13, gameChar_y - 45, gameChar_x - 17, gameChar_y - 60);
        line(gameChar_x + 13, gameChar_y - 45, gameChar_x + 17, gameChar_y - 60);
        //eyes
        noStroke(); 
        fill(0);
        rect(gameChar_x - 6, gameChar_y - 63, 3, 5);
        rect(gameChar_x + 3, gameChar_y - 63, 3, 5);

	}
	else
	{
		// add your standing front facing code
        
        //legs
        fill(0);
        ellipse(gameChar_x - 9, gameChar_y - 1, 10, 10);
        ellipse(gameChar_x + 9, gameChar_y - 1, 10, 10);
        //body
        fill(255, 102, 255);
        rect(gameChar_x - 15, gameChar_y -50, 30, 45, 4);
        //head
        fill(255, 230, 204);
        ellipse(gameChar_x, gameChar_y - 60, 25, 25);
        //eyes
        fill(0);
        rect(gameChar_x - 6, gameChar_y - 63, 3, 5);
        rect(gameChar_x + 3, gameChar_y - 63, 3, 5);


	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for (var i = 0; i < clouds.length; i++) {
        //cloud1
        noStroke();
        fill(199, 206, 215);
        ellipse(
            clouds[i].x_pos, 
            clouds[i].y_pos + clouds[i].size * 1, 
            clouds[i].size * 10, 
            clouds[i].size * 10
        );
        ellipse(
            clouds[i].x_pos - clouds[i].size * 5, 
            clouds[i].y_pos + clouds[i].size * 1, 
            clouds[i].size * 7, 
            clouds[i].size * 7
        );
        ellipse(
            clouds[i].x_pos + clouds[i].size * 5, 
            clouds[i].y_pos + clouds[i].size * 1, 
            clouds[i].size * 7, 
            clouds[i].size * 7
        );
        fill(255);
        ellipse(
            clouds[i].x_pos, 
            clouds[i].y_pos, 
            clouds[i].size * 10, 
            clouds[i].size * 10
        );
        ellipse(
            clouds[i].x_pos - clouds[i].size * 5, 
            clouds[i].y_pos, 
            clouds[i].size * 7, 
            clouds[i].size * 7
        );
        ellipse(
            clouds[i].x_pos + clouds[i].size * 5, 
            clouds[i].y_pos, 
            clouds[i].size * 7, 
            clouds[i].size * 7
        );
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for (var i = 0; i < clouds.length; i++) {
        noStroke();
        fill(0, 118, 255);
        triangle(
            mountains[i].x_pos, 
            mountains[i].y_pos, 
            mountains[i].x_pos + mountains[i].size * 20, 
            mountains[i].y_pos - mountains[i].size * 23.2, 
            mountains[i].x_pos + mountains[i].size * 40, 
            mountains[i].y_pos
        );

        fill(255);
        quad(
            mountains[i].x_pos + mountains[i].size * 15.6, 
            mountains[i].y_pos - mountains[i].size * 18.2, 
            mountains[i].x_pos + mountains[i].size * 20, 
            mountains[i].y_pos - mountains[i].size * 23.2, 
            mountains[i].x_pos + mountains[i].size * 24.4, 
            mountains[i].y_pos - mountains[i].size * 18.2, 
            mountains[i].x_pos + mountains[i].size * 20, 
            mountains[i].y_pos - mountains[i].size * 16.2
        );
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++) {
        //tree1
        fill(165, 42, 42);
        rect(trees_x[i], treePos_y + 100, 10, 50);
        fill(47, 79, 79);
        triangle(
            trees_x[i] + 5, 
            treePos_y + 40, 
            trees_x[i] - 30, 
            treePos_y + 110, 
            trees_x[i] + 40, 
            treePos_y + 110
        );
        triangle(
            trees_x[i] + 5, 
            treePos_y + 20, 
            trees_x[i] - 30, 
            treePos_y + 90, 
            trees_x[i] + 40, 
            treePos_y + 90
        );
        fill(0, 100, 0);
        triangle(
            trees_x[i] + 5, 
            treePos_y + 40, 
            trees_x[i] - 30, 
            treePos_y + 110, 
            trees_x[i] + 20, 
            treePos_y + 110
        );
        triangle(
            trees_x[i] + 5, 
            treePos_y + 20, 
            trees_x[i] - 30, 
            treePos_y + 90, 
            trees_x[i] + 20, 
            treePos_y + 90
        );
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    noStroke();
    fill(100, 155, 255);
    rect(t_canyon.x_pos, 432, t_canyon.width, 144);

    fill(165, 42, 42);
    triangle(
        t_canyon.x_pos, 
        432, 
        t_canyon.x_pos, 
        576, 
        t_canyon.x_pos - 10, 
        576
    );
    triangle(
        t_canyon.x_pos + t_canyon.width, 
        432, 
        t_canyon.x_pos + t_canyon.width, 
        576, 
        t_canyon.x_pos + 10 + t_canyon.width, 
        576
    );
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if ((gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width) && 
        gameChar_y >= floorPos_y) 
    {
        isPlummeting = true;
        plummetingSound.play();
    }
    
    if (isPlummeting == true) 
    {
        gameChar_y += 10;
    }
}

function renderFlagpole() 
{
    push();
    stroke(150);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 256);
    stroke(255, 0, 0);
    noStroke();
    if(flagpole.isReached == true)
    {
        triangle(
        flagpole.x_pos, 
        floorPos_y - 250, 
        flagpole.x_pos, 
        floorPos_y - 190, 
        flagpole.x_pos + 60, 
        floorPos_y - 220
        );
    } else {
        triangle(
        flagpole.x_pos, 
        floorPos_y - 60, 
        flagpole.x_pos, 
        floorPos_y, 
        flagpole.x_pos + 60, 
        floorPos_y - 30
        );
    }
    
    stroke(255, 214, 51);
    strokeWeight(11);
    point(flagpole.x_pos + 1, floorPos_y - 256);
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 15)
    {
        flagpole.isReached = true;
    }  
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    
    this.draw = function()
    {
        this.update();
        //legs
        fill(77, 0, 77);
        ellipse(this.currentX - 20, this.y + 25, 25, 15);
        ellipse(this.currentX + 20, this.y + 25, 25, 15);
        //body
        fill(153, 51, 255);
        ellipse(this.currentX, this.y, 60, 60);
        //eyes
        fill(255);
        ellipse(this.currentX - 15, this.y - 25, 20, 20);
        ellipse(this.currentX + 15, this.y - 25, 20, 20);
        fill(0);
        ellipse(this.currentX - 15, this.y - 25, 10, 10);
        ellipse(this.currentX + 15, this.y - 25, 10, 10);
        //mouth
        fill(200, 0, 0);
        rect(this.currentX - 15, this.y - 10, 30, 15);
        //tongue
        fill(230, 0, 0);
        ellipse(this.currentX, this.y + 5, 30, 25);
        stroke(200, 0, 0);
        strokeWeight(2);
        line(this.currentX, this.y - 10, this.currentX, this.y + 18);
        noStroke();
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        
        if(d < 50)
        {
            return true;    
        }
        return false;
    }
}

function checkPlayerDie()
{
    if(gameChar_y >= height)
    {
        isDied = true;
    }
    if(lives >= 1)
    {
        isGameover = false;
    }else{
        isGameover = true;
    }
    
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    strokeWeight(t_collectable.size * 4 /50);
    stroke(255, 215, 0);
    noFill();
    ellipse(
        t_collectable.x_pos, 
        t_collectable.y_pos, 
        t_collectable.size * 40 / 50, 
        t_collectable.size * 40 / 50
    );

    noStroke();
    fill(255, 0, 0);
    quad(
        t_collectable.x_pos - t_collectable.size * 20 / 50, 
        t_collectable.y_pos - t_collectable.size * 40 / 50, 
        t_collectable.x_pos + t_collectable.size * 20 / 50, 
        t_collectable.y_pos - t_collectable.size * 40 / 50, 
        t_collectable.x_pos + t_collectable.size * 10 / 50, 
        t_collectable.y_pos - t_collectable.size * 50 / 50, 
        t_collectable.x_pos - t_collectable.size * 10 / 50, 
        t_collectable.y_pos - t_collectable.size * 50 / 50
    );
    triangle(
        t_collectable.x_pos, 
        t_collectable.y_pos - t_collectable.size * 20 / 50, 
        t_collectable.x_pos - t_collectable.size * 20 / 50, 
        t_collectable.y_pos - t_collectable.size * 40 / 50, 
        t_collectable.x_pos + t_collectable.size * 20 / 50, 
        t_collectable.y_pos - t_collectable.size * 40 / 50
    );

    fill(194, 0, 0);
    triangle(
        t_collectable.x_pos, 
        t_collectable.y_pos - t_collectable.size * 20 / 50, 
        t_collectable.x_pos + t_collectable.size * 10 / 50, 
        t_collectable.y_pos - t_collectable.size * 39 / 50, 
        t_collectable.x_pos + t_collectable.size * 20 / 50, 
        t_collectable.y_pos - t_collectable.size * 40 / 50
    );
    triangle(
        t_collectable.x_pos, 
        t_collectable.y_pos - t_collectable.size * 20 / 50, 
        t_collectable.x_pos - t_collectable.size * 20 / 50, 
        t_collectable.y_pos - t_collectable.size * 40 / 50, 
        t_collectable.x_pos - t_collectable.size * 10 / 50, 
        t_collectable.y_pos - t_collectable.size * 39 / 50
    );

    fill(255, 69, 69);
    quad(
        t_collectable.x_pos - t_collectable.size * 10 / 50, 
        t_collectable.y_pos - t_collectable.size * 39 / 50, 
        t_collectable.x_pos + t_collectable.size * 10 / 50, 
        t_collectable.y_pos - t_collectable.size * 39 / 50, 
        t_collectable.x_pos + t_collectable.size * 10 / 50, 
        t_collectable.y_pos - t_collectable.size * 50 / 50, 
        t_collectable.x_pos - t_collectable.size * 10 / 50, 
        t_collectable.y_pos - t_collectable.size * 50 / 50
    );
    
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 50) 
    {
        t_collectable.isFound = true;
        itemIsCollectedSound.play();
        game_score += 1;
    }
}

function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(77, 19, 0);
            rect(this.x, this.y, this.length, 15);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    }
    
    return p;
}