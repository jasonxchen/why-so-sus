// VARIABLES
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");    // Apply 2D rendering context for canvas
// Adjust canvas resolution based on screen resolution used
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);
const civArray = [];
const colorArray = ["red", "blue", "white", "black"];

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
        ctx.fillStyle = "black";    // Default black render
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

// FUNCTIONS
const randomNum = (min, max) =>
{
    return Math.floor(Math.random() * (max - min)) + min;
}
const playerInput = e =>
{
    const step = 50;    // 1 pixel step at a time
    if (player.isAlive)
    {
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
//          case " ":
//              console.log("pew");
            default:
                break;
        }
//        gameUpdate();    // USE FOR REFRESHING SCREEN ON MOVEMENT
    }
}
document.addEventListener("keydown", playerInput);

const gameUpdate = () =>
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);    // Clear the canvas
    // Rendering
    if (player.isAlive)
    {
        player.render();
    }
    civArray.forEach((civilian, i) =>
    {
        if (civilian.isAlive)
        {
            civilian.render();
        }
    })
}

// TEMP
const player = new Person(500, 0, 25, 50);    // Initialization of Player
const civInit = 7;    // How many NPCs to start out with
const killerIndex = Math.floor(Math.random() * civInit);
for (let i = 0; i < civInit; i++)
{
    if (i === killerIndex)    // Make this random NPC the killer
    {
        console.log("muahahaha")
        const killer = new Killer(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 50), 25, 50);
        civArray.push(killer);
    }
    else
    {
        // 25px and 50px for max in random num gen to allow space for object model
        const newCiv = new Civilian(randomNum(0, canvas.width - 25), randomNum(0, canvas.height - 50), 25, 50);
        civArray.push(newCiv);
    }
}
const gameUpdateInterval = setInterval(gameUpdate, 100);    // USE FOR REFRESHING SCREEN EVERY 60 ms