// VARIABLES
const canvas = document.querySelector("canvas");
const clueList = document.querySelector("#clue-list");
const ctx = canvas.getContext("2d");    // Apply 2D rendering context for canvas
// Adjust canvas resolution based on screen resolution used
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);
const civArray = [];
const colorArray = ["red", "lime", "blue", "black"];
const clueArray = [];

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
    render = () =>
    {
        ctx.fillStyle = "hotpink";    // Default hotpink render
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Civilian extends Person
{
    constructor (xPos, yPos, width, height)
    {
        super(xPos, yPos, width, height);
        this.isKiller = false;
        this.hatColor = colorArray[randomNum(0, colorArray.length)]    // Hat color
        this.shirtColor = colorArray[randomNum(0, colorArray.length)]    // Shirt color
        this.pantsColor = colorArray[randomNum(0, colorArray.length)]    // Pants color
        this.shoeColor = colorArray[randomNum(0, colorArray.length)]    // Shoe color
    }
    render = () =>
    {
        // Default height: 50px (5px hat 20px shirt, 20px pants, 5px shoes)
        ctx.fillStyle = this.hatColor;
        ctx.fillRect(this.x, this.y, this.width, 5);
        ctx.fillStyle = this.shirtColor;
        ctx.fillRect(this.x, this.y + 5, this.width, 20);
        ctx.fillStyle = this.pantsColor;
        ctx.fillRect(this.x, this.y + 25, this.width, 20);
        ctx.fillStyle = this.shoeColor;
        ctx.fillRect(this.x, this.y + 45, this.width, 5);
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
        ctx.fillStyle = "rgba(237, 224, 216, 1)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// FUNCTIONS
const randomNum = (min, max) =>
{
    return Math.floor(Math.random() * (max - min)) + min;
}
const playerInput = e =>    // Keyboard controls
{
    const step = 50;    // # pixel step at a time
    if (player.isAlive && killer.isAlive)    // Stops movement if either is killed
    {
        if (gameUpdateInterval === 0)
        {
            gameUpdateInterval = setInterval(gameUpdate, 100);    // Start game with refresh rate of 1000/# frames per second on keyboard input
            return;    // Does not factor in first keyboard input for player movement
        }
        switch (e.key)
        {
            case "w":
                player.y -= step;    // Move player up
                if (player.y < 0)
                {
                    player.y = 0;    // Prevent moving out of top of screen
                }
                break;
            case "a":
                player.x -= step;    // Move player left
                if (player.x < 0)
                {
                    player.x = 0;    // Prevent moving out of left of screen
                }
                break;
            case "s":
                player.y += step;    // Move player down
                if (player.y + player.height > canvas.height)
                {
                    player.y = canvas.height - player.height;        // Prevent moving out of bottom of screen
                }
                break;
            case "d":
                player.x += step;    // Move player right
                if (player.x + player.width > canvas.width)
                {
                    player.x = canvas.width - player.width;        // Prevent moving out of right of screen
                }
                break;
            default:
                break;
        }
    }
}
document.addEventListener("keydown", playerInput);

canvas.addEventListener("click", e =>
{
    // Adjust coordinates so that the top left pixel of canvas will return (0,0)
    const cRect = canvas.getBoundingClientRect();    // Get canvas pos, width, and height
    civArray.forEach(civilian =>
    {
        // If the point clicked is past NPC's right, left, bottom, and top at the same time respectively
        if (e.clientX - cRect.left <= civilian.x + civilian.width && e.clientX - cRect.left >= civilian.x && e.clientY - cRect.top <= civilian.y + civilian.height && e.clientY - cRect.top >= civilian.y)
        {
            civilian.isAlive = false;    // Assassinates NPC clicked
            if (civilian.isKiller)
            {
                gameOver("you win");
                clearInterval(gameUpdateInterval);
            }
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

const gameOver = (message) =>
{
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 55, 200, 100);    // Center black opaque blackground
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

const howToPlay = () =>
{
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("How To Play:", canvas.width / 2, canvas.height / 2 - 150);
    ctx.fillText("1. Collect up to four clues to reveal information about the killer", canvas.width / 2, canvas.height / 2 - 80);
    ctx.fillText("2. Left click with your mouse who you think it is", canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText("3. Avoid the killer or else you lose", canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText("4. Use WASD to move", canvas.width / 2, canvas.height / 2 + 70);
    ctx.fillText("5. Have fun! Press any button to start", canvas.width / 2, canvas.height / 2 + 120);
}

const gameUpdate = () =>
{
    if (killer.isAlive)    // Don't update canvas if killer is found out the "frame" before; lets the win message stay on screen
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);    // Clear the canvas
        // Rendering
        if (player.isAlive)
        {
            player.render();
        }
        civArray.forEach(civilian =>
        {
            if (civilian.isAlive)
            {
                civilian.render();
            }
        })
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
        // Loss collision detection
        if (checkHit(player, killer) && killer.isAlive)
        {
            player.isAlive = false;    // Kills player if they encouter the killer
            gameOver("you died");
        }
    }
}

// MORE VARIABLES
const player = new Person(canvas.width / 2 - 12.5, canvas.height / 2 - 25, 25, 50);    // Initialization of Player in the middle of canvas
const civInit = 7;    // How many NPCs to start out with
const killerIndex = Math.floor(Math.random() * civInit);
const killer = new Killer(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 50), 25, 50);
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