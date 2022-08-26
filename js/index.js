// VARIABLES
const canvas = document.querySelector("canvas");
const clueList = document.querySelector("#clue-list");
const scoreNum = document.querySelector(".score-number");
const timer = document.querySelector("#timer");
const timeLimit = 120;    // Total seconds given for earning points
let timePassed = 0;
let timeLeft = timeLimit;
let timerInterval = null;
const ctx = canvas.getContext("2d");    // Apply 2D rendering context for canvas
// Adjust canvas resolution based on screen resolution used
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);
const colorArray = ["red", "lime", "blue", "black"];
const moveArray = ["up", "left", "down", "right"];
const laserArray = [0, 0, 0, 0];    // Initial power of lasers at top, left, bottom, and right set to 0 respectively
const keys = [false, false, false, false, false, false, false, false];    // Set [W,A,S,D,I,J,K,L] initial press to false

class Person    // Super class for all moving game entities
{
    constructor (xPos, yPos, width, height)
    {
        this.x = xPos;
        this.y = yPos;
        this.width = width;
        this.height = height;
        this.isAlive = true;
    }
    render = () =>    // Render function for player
    {
        const img = new Image();
        img.src = "./img/player.png";
        ctx.drawImage(img, this.x, this.y);
    }
}
class Civilian extends Person
{
    constructor (xPos, yPos, width, height)
    {
        super(xPos, yPos, width, height);
        this.isKiller = false;
        this.hatColor = colorArray[randomNum(0, colorArray.length)];      // Hat color
        this.shirtColor = colorArray[randomNum(0, colorArray.length)];    // Shirt color
        this.pantsColor = colorArray[randomNum(0, colorArray.length)];    // Pants color
        this.shoeColor = colorArray[randomNum(0, colorArray.length)];     // Shoe color
        // No initial move directions
        this.moveUp = false;
        this.moveLeft = false;
        this.moveDown = false;
        this.moveRight = false;
    }
    render = () =>
    {
        // WIP NPC model
        // Default height: 50px (5px hat 8px face 19px shirt, 15px pants, 3px shoes)
        ctx.fillStyle = this.hatColor;    // Start hat
        ctx.beginPath();
        ctx.moveTo(this.x + 7, this.y + 5);
        ctx.bezierCurveTo(this.x + 9, this.y, this.x + 16, this.y, this.x + 18, this.y + 5);
        ctx.fill();    // Finish hat
        ctx.fillStyle = "yellow";    // Face color
        ctx.fillRect(this.x + 6, this.y + 5, 13, 8);    // Face shape
        ctx.fillStyle = this.shirtColor;
        ctx.fillRect(this.x, this.y + 13, this.width, 19);
        ctx.fillStyle = this.pantsColor;
        ctx.fillRect(this.x + 6, this.y + 32, 5, 15);    // Left leg
        ctx.fillRect(this.x + 14, this.y + 32, 5, 15);    // Right leg
        ctx.fillStyle = this.shoeColor;
        ctx.fillRect(this.x + 4, this.y + 47, 7, 3);    // Left shoe
        ctx.fillRect(this.x + 14, this.y + 47, 7, 3);    // Right shoe
    }
}
class Killer extends Civilian
{
    constructor (xPos, yPos, width, height)
    {
        super(xPos, yPos, width, height);
        this.isKiller = true;
    }
}
class Clue    // Simple enough to extend from person; new super class for semantics
{
    constructor (xPos, yPos, width, height, info)
    {
        this.x = xPos;
        this.y = yPos;
        this.width = width;
        this.height = height;
        this.info = info;
        this.unobtained = true;
    }
    render = () =>
    {
        const img = new Image();
        img.src = "./img/clue.png";
        ctx.drawImage(img, this.x, this.y);
    }
}

// FUNCTIONS
const startTimer = () =>
{
    timerInterval = setInterval(() =>
    {
        timePassed++;
        timeLeft = timeLimit - timePassed;
        timer.innerText = timeLeft;
        if (timeLeft === 0)
        {
            clearInterval(timerInterval);
        }
    }, 1000)
}

const randomNum = (min, max) =>    // max not included in range
{
    return Math.floor(Math.random() * (max - min)) + min;
}
const randomMove = civilian =>    // Gives NPC new movement direction
{
    let randomDir = moveArray[randomNum(0, moveArray.length)];    // Initial random direction
    if (civilian.moveUp)    // What was the last movement direction
    {
        randomDir = "up";
    }
    else if (civilian.moveLeft)
    {
        randomDir = "left";
    }
    else if (civilian.moveDown)
    {
        randomDir = "down";
    }
    else if (civilian.moveRight)
    {
        randomDir = "right";
    }
    if (frameNum % 25 === 0 && frameNum !== 0)    // Restricts change direction to every # frames except the first (adjust as needed for natural roaming)
    {
        randomDir = moveArray[randomNum(0, moveArray.length)];    // New random direction
        if (civilian.isKiller && randomNum(0, 3) === 1)    // Killer has 33.33%(+25% random) chance of moving towards player (can adjust for difficulty)
        {
            if (Math.abs(player.x - killer.x) >= Math.abs(player.y - killer.y))    // If killer is farther horizontally than vertically
            {
                if (player.x - killer.x > 0)    // If killer is to the left of player
                {
                    randomDir = "right";    // Move right (towards player)
                }
                else
                {
                    randomDir = "left";    // Move left (towards player)
                }
            }
            else
            {
                if (player.y - killer.y > 0)    // If killer is above player
                {
                    randomDir = "down";    // Move down
                }
                else
                {
                    randomDir = "up";    // Move up
                }
            }
        }
    }
    switch (randomDir)    // Change object variables based on movement direction
    {
        case "up":
            // Only one direction allowed at a time
            civilian.moveUp = true;
            civilian.moveLeft = false;
            civilian.moveDown = false;
            civilian.moveRight = false;
            break;
        case "left":
            civilian.moveUp = false;
            civilian.moveLeft = true;
            civilian.moveDown = false;
            civilian.moveRight = false;
            break;
        case "down":
            civilian.moveUp = false;
            civilian.moveLeft = false;
            civilian.moveDown = true;
            civilian.moveRight = false;
            break;
        case "right":
            civilian.moveUp = false;
            civilian.moveLeft = false;
            civilian.moveDown = false;
            civilian.moveRight = true;
            break;
        default:
            break;
    }
    startMove(civilian);    // Calculate new coordinates
}
const startMove = civilian =>
{
    const step = 2;    // # pixel step at a time (can adjust for difficulty)
    if (civilian.moveUp)
    {
        civilian.y -= step;    // Move up
        if (civilian.y < 0)
        {
            civilian.y = 0;    // Prevent moving out of top of screen
        }
    }
    else if (civilian.moveLeft)
    {
        civilian.x -= step;    // Move left
        if (civilian.x < 0)
        {
            civilian.x = 0;    // Prevent moving out of left of screen
        }
    }
    else if (civilian.moveDown)
    {
        civilian.y += step;    // Move down
        if (civilian.y + civilian.height > canvas.height)
        {
            civilian.y = canvas.height - civilian.height;        // Prevent moving out of bottom of screen
        }
    }
    else if (civilian.moveRight)
    {
        civilian.x += step;    // Move right
        if (civilian.x + civilian.width > canvas.width)
        {
            civilian.x = canvas.width - civilian.width;        // Prevent moving out of right of screen
        }
    }
}

const playerInput = () =>    // Keyboard controls
{
    const step = 4;    // # pixel step at a time
    if (player.isAlive && killer.isAlive)    // Stops movement if either is killed
    {
        if (gameUpdateInterval === 0)    // Only runs the one time after dismissing game instructions
        {
            gameUpdateInterval = setInterval(gameUpdate, 20);    // Start game with refresh rate of 1000/# frames per second on keyboard input
            timer.innerText = timeLeft;    // Display time remaining first
            startTimer();    // Start timer
            return;    // Does not factor in first keyboard input for player movement
        }
        if (keys[0])
        {
            player.y -= step;    // Move player up
            if (player.y < 0)
            {
                player.y = 0;    // Prevent moving out of top of screen
            }
        }
        if (keys[1])
        {
            player.x -= step;    // Move player left
            if (player.x < 0)
            {
                player.x = 0;    // Prevent moving out of left of screen
            }
        }
        if (keys[2])
        {
            player.y += step;    // Move player down
            if (player.y + player.height > canvas.height)
            {
                player.y = canvas.height - player.height;        // Prevent moving out of bottom of screen
            }
        }
        if (keys[3])
        {
            player.x += step;    // Move player right
            if (player.x + player.width > canvas.width)
            {
                player.x = canvas.width - player.width;        // Prevent moving out of right of screen
            }
        }
        // Visually display lasers (actual hit detection in gameUpdate)
        if (keys[4])
        {
            let width = 2;    // Initial laser width
            if (laserArray[0] >= 5 && laserArray[0] < 16)    // Check power in laserArray
            {
                width += 4;
            }
            else if (laserArray[0] >= 16)
            {
                width += 12;
            }
            ctx.fillStyle = "aqua";
            ctx.fillRect(player.x + player.width / 2 - width / 2, 0, width, player.y);    // Visual laser up
            civArray.forEach(civilian =>
            {
                if (checkLaserHit(player.x + player.width / 2 - width / 2, 0, width, player.y, civilian))    // If laser hits anyone
                {
                    checkIfWin(civilian);
                }
            })
        }
        if (keys[5])
        {
            let height = 2;
            if (laserArray[1] >= 5 && laserArray[1] < 16)
            {
                height += 4;
            }
            else if (laserArray[1] >= 16)
            {
                height += 12;
            }
            ctx.fillStyle = "aqua";
            ctx.fillRect(0, player.y + player.height / 2 - height / 2, player.x, height);    // Visual laser left
            civArray.forEach(civilian =>
            {
                if (checkLaserHit(0, player.y + player.height / 2 - height / 2, player.x, height, civilian))
                {
                    checkIfWin(civilian);
                }
            })
        }
        if (keys[6])
        {
            let width = 2;
            if (laserArray[2] >= 5 && laserArray[2] < 16)
            {
                width += 4;
            }
            else if (laserArray[2] >= 16)
            {
                width += 12;
            }
            ctx.fillStyle = "aqua";
            ctx.fillRect(player.x + player.width / 2 - width / 2, player.y + player.height, width, canvas.height - player.y - player.height);    // Visual laser down
            civArray.forEach(civilian =>
            {
                if (checkLaserHit(player.x + player.width / 2 - width / 2, player.y + player.height, width, canvas.height - player.y - player.height, civilian))
                {
                    checkIfWin(civilian);
                }
            })
        }
        if (keys[7])
        {
            let height = 2;
            if (laserArray[3] >= 5 && laserArray[3] < 16)
            {
                height += 4;
            }
            else if (laserArray[3] >= 16)
            {
                height += 12;
            }
            ctx.fillStyle = "aqua";
            ctx.fillRect(player.x + player.width, player.y + player.height / 2 - height / 2, canvas.width - player.x - player.width, height);    // Visual laser right
            civArray.forEach(civilian =>
            {
                if (checkLaserHit(player.x + player.width, player.y + player.height / 2 - height / 2, canvas.width - player.x - player.width, height, civilian))
                {
                    checkIfWin(civilian);
                }
            })
        }
    }
}
document.addEventListener("keydown", e =>
{
    playerInput();    // Call function in order to start game from instruction screen
    switch (e.key)    // Have to use switch since keyCode is deprecated
    {
        case "w":
            keys[0] = true;    // Is moving up with "W"
            break;
        case "a":
            keys[1] = true;    // Is moving left with "A"
            break;
        case "s":
            keys[2] = true;    // Is moving right with "S"
            break;
        case "d":
            keys[3] = true;    // Is moving down with "D"
            break;
        case "i":
            keys[4] = true;     // Top laser firing with "I"
            laserArray[0]++;    // Increase laser power
            break;
        case "j":
            keys[5] = true;    // Left laser firing with "J"
            laserArray[1]++;
            break;
        case "k":
            keys[6] = true;    // Bottom laser firing with "K"
            laserArray[2]++;
            break;
        case "l":
            keys[7] = true;    // Right laser firing with "L"
            laserArray[3]++;
            break;
        default:
            break;
    }
});
document.addEventListener("keyup", e =>    // Cancel specific directional movement and/or laser
{
    switch (e.key)
    {
        case "w":
            keys[0] = false;
            break;
        case "a":
            keys[1] = false;
            break;
        case "s":
            keys[2] = false;
            break;
        case "d":
            keys[3] = false;
            break;
        case "i":
            keys[4] = false;
            laserArray[0] = 0;    // Reset laser power
            break;
        case "j":
            keys[5] = false;
            laserArray[1] = 0;
            break;
        case "k":
            keys[6] = false;
            laserArray[2] = 0;
            break;
        case "l":
            keys[7] = false;
            laserArray[3] = 0;
            break;
        default:
            break;
    }
});

canvas.addEventListener("mousedown", e =>
{
    // Adjust coordinates so that the top left pixel of canvas will return (0,0)
    const cRect = canvas.getBoundingClientRect();    // Get canvas pos, width, and height
    civArray.forEach(civilian =>
    {
        // If the point clicked is past NPC's right, left, bottom, and top at the same time respectively
        if (player.isAlive && e.clientX - cRect.left <= civilian.x + civilian.width && e.clientX - cRect.left >= civilian.x && e.clientY - cRect.top <= civilian.y + civilian.height && e.clientY - cRect.top >= civilian.y)
        {
            checkIfWin(civilian);
        }
    })
})

const checkHit = (objOne, objTwo) =>
{
    // If objOne passes objTwo on objTwo's right, left, bottom, and top at the same time respectively
    if (objOne.x <= objTwo.x + objTwo.width && objOne.x + objOne.width >= objTwo.x && objOne.y <= objTwo.y + objTwo.height && objOne.y + objOne.height >= objTwo.y)
    {
        return true;
    }
    else
    {
        return false;
    }
}
const checkLaserHit = (xPos, yPos, width, height, objTwo) =>
{
    // Repurposed checkHit to compare using laser x-coordinate, y-coordinate, width, and height
    if (xPos <= objTwo.x + objTwo.width && xPos + width >= objTwo.x && yPos <= objTwo.y + objTwo.height && yPos + height >= objTwo.y)
    {
        return true;
    }
    else
    {
        return false;
    }
}

const checkIfWin = civilian =>
{
    if (civilian.isKiller && killer.isAlive)
    {
        if (timeLeft > 0)    // If time has not run out yet
        {
            score += 2500;    // Gain 2500 points for correct elimination
        }
        killer.isAlive = false;
        gameUpdate();
        gameOver("🏆 You Win 🏆", "Target Eliminated");
    }
    else if (civilian.isAlive)
    {
        if (timeLeft > 0)
        {
            score -= 100;    // Lose 100 points for every incorrect elimination
        }
        civilian.isAlive = false;    // Assassinates NPC
    }
}
const gameOver = (outcome, reason) =>
{
    clearInterval(gameUpdateInterval);    // Stops game from updating
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(canvas.width / 2 - 225, canvas.height / 2 - 110, 450, 200);    // Center black opaque blackground
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(outcome, canvas.width / 2, canvas.height / 2 - 60);
    ctx.fillText(reason, canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText("Press [Space] to play again", canvas.width / 2, canvas.height / 2 + 50);
    const replay = e =>    // Define replay event
    {
        if (e.key === " ")
        {
            resetGame();    // Calls function to reset game state
            document.removeEventListener("keydown", replay);    // Remove event listener so it only registers here and once
        }
    }
    document.addEventListener("keydown", replay);    // On key press, call replay function
}

const howToPlay = () =>
{
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("How To Play:", canvas.width / 2, canvas.height / 2 - 190);
    ctx.fillText("1. Collect up to four clues to reveal information about the killer", canvas.width / 2, canvas.height / 2 - 135);
    ctx.fillText("2. To win, left click with your mouse who you think it is", canvas.width / 2, canvas.height / 2 - 85);
    ctx.fillText("...or use IJKL for lazoooor (stand still to charge)", canvas.width / 2, canvas.height / 2 - 35);
    ctx.fillText("3. Lose points on killing an innocent and gain points on a win", canvas.width / 2, canvas.height / 2 + 15);
    ctx.fillText("4. Avoid the killer or else it's game over and you lose points", canvas.width / 2, canvas.height / 2 + 65);
    ctx.fillText("5. Points only count within the time limit at the top", canvas.width / 2, canvas.height / 2 + 115);
    ctx.fillText("6. Use WASD to move", canvas.width / 2, canvas.height / 2 + 165);
    ctx.fillText("7. Have fun! Press any button to start", canvas.width / 2, canvas.height / 2 + 215);
}

const gameUpdate = () =>
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);    // Clear the canvas
    // Loss collision detection
    if (checkHit(player, killer) && killer.isAlive)
    {
        if (timeLeft > 0)
        {
            score -= 1000;    // Lose 1000 points for every player death;
        }
        player.isAlive = false;    // Kills player if they encouter the killer
    }
    // Rendering
    clueArray.forEach(clue =>
    {
        if (clue.unobtained)
        {
            clue.render();
            if (checkHit(player, clue))    // Check after render if player walks over clue
            {
                const pushClue = document.createElement("li");
                pushClue.innerText = clue.info;
                clueList.append(pushClue);
                clue.unobtained = false;    // Ater the next gameUpdate "frame," the clue will no longer be rendered
            }   
        }
    })
    civArray.forEach(civilian =>
    {
        if (civilian.isAlive)
        {
            randomMove(civilian);    // Calculate next NPC coordinate
            civilian.render();
        }
    })
    if (player.isAlive)
    {
        player.render();
    }
    playerInput();    // Make every gameUpdate factor in player input
    if (!player.isAlive)
    {
        gameOver("🪦 You Died 🪦", "Killer Encountered");    // Displays at the end so that game over message won't be blocked
    }
    scoreNum.innerHTML = score;
    frameNum++;
}

// STARTING VARIABLES
let score = 0;
let frameNum = 0;    // Keep track of frame count; helps to slow NPC movement by limiting randomMove function call
const civArray = [];
const clueArray = [];
const player = new Person(canvas.width / 2 - 12.5, canvas.height / 2 - 25, 25, 50);    // Initialization of Player in the middle of canvas
const civInit = 63;    // How many NPCs to start out with (can adjust for difficulty)
let killerIndex = Math.floor(Math.random() * civInit);
const killer = new Killer(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 50), 25, 50);
for (let i = 0; i < civInit; i++)    // Fill array with NPCs
{
    if (i === killerIndex)    // Make this random NPC the killer
    {
        civArray.push(killer);
    }
    else
    {
        // 25px and 50px for max in random num gen to allow space for object model
        const newCiv = new Civilian(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 50), 25, 50);
        civArray.push(newCiv);
    }
}
// Pushing the (4) clues to array
let newClue = new Clue(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 25), 25, 25, `Hat color: ${killer.hatColor}`);
clueArray.push(newClue);
newClue = new Clue(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 25), 25, 25, `Shirt color: ${killer.shirtColor}`);
clueArray.push(newClue);
newClue = new Clue(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 25), 25, 25, `Pants color: ${killer.pantsColor}`);
clueArray.push(newClue);
newClue = new Clue(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 25), 25, 25, `Shoe color: ${killer.shoeColor}`);
clueArray.push(newClue);

let gameUpdateInterval = 0;    // Make sure interval is not defined in order to show instructions first
// Interval is set later in playerInput() when a keyboard button is pressed
howToPlay();    // Display objectives and controls on screen before rendering game

const resetGame = () =>    // Frontend and backend reset of game variables
{
    while (clueList.firstChild)    // Clears clue list
    {
        clueList.removeChild(clueList.firstChild);
    }
//    scoreNum.innerText = "0";    // Optional: reset score every replay
//    score = 0;    // Optional: reset score every replay
    frameNum = 0;
    // Bring player back to life and reset position
    player.x = canvas.width / 2 - 12.5;
    player.y = canvas.height / 2 - 25;
    player.isAlive = true;
    // Bring killer back to life with new position and colors
    killer.x = randomNum(0, canvas.width - 25);
    killer.y = randomNum(0, canvas.height - 50);
    killer.isAlive = true;
    killer.hatColor = colorArray[randomNum(0, colorArray.length)];
    killer.shirtColor = colorArray[randomNum(0, colorArray.length)];
    killer.pantsColor = colorArray[randomNum(0, colorArray.length)];
    killer.shoeColor = colorArray[randomNum(0, colorArray.length)];
    killerIndex = Math.floor(Math.random() * civInit);    // New killer index for more randomness
    civArray.length = 0;    // Reset array of NPCs
    // Fill array with new NPCs
    for (let i = 0; i < civInit; i++)
    {
        if (i === killerIndex)    // Make this random NPC the killer
        {
            civArray.push(killer);
        }
        else
        {
            // 25px and 50px for max in random num gen to allow space for object model
            const newCiv = new Civilian(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 50), 25, 50);
            civArray.push(newCiv);
        }
    }
    clueArray.length = 0;    // Reset array of clues
    newClue = new Clue(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 25), 25, 25, `Hat color: ${killer.hatColor}`);
    clueArray.push(newClue);
    newClue = new Clue(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 25), 25, 25, `Shirt color: ${killer.shirtColor}`);
    clueArray.push(newClue);
    newClue = new Clue(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 25), 25, 25, `Pants color: ${killer.pantsColor}`);
    clueArray.push(newClue);
    newClue = new Clue(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 25), 25, 25, `Shoe color: ${killer.shoeColor}`);
    clueArray.push(newClue);
    gameUpdateInterval = setInterval(gameUpdate, 20);    // Refreshes board and restarts game ticking
}