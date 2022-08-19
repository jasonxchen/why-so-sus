// VARIABLES
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");    // Apply 2D rendering context for canvas
// Adjust canvas resolution based on screen resolution used
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);
const civArray = [];

class Person    // Super class for all moving game entities
{
    constructor(xPos, yPos, width, height)
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
    render = () =>
    {
        // Default height: 50px (5px hat 20px shirt, 20px pants, 5px shoes)
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, 5); // Hat color
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y + 5, this.width, 20); // Shirt color
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y + 25, this.width, 20); // Pants color
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y + 45, this.width, 5); // Shoe color
    }
}

// FUNCTIONS
const randomX = () =>    // Give random x-coordinate within canvas space
{
    return Math.floor(Math.random() * (canvas.width - 25));    // Max @ 25px left of end to allow space for object model
}
const randomY = () =>    // Give random y-coordinate within canvas space
{
    return Math.floor(Math.random() * (canvas.height - 50));    // Max @ 50px above end to allow space for object model
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
for (let i = 0; i < 2; i++)
{
    const newCiv = new Civilian(randomX(), randomY(), 25, 50);
    civArray.push(newCiv);
}
const gameUpdateInterval = setInterval(gameUpdate, 100);    // USE FOR REFRESHING SCREEN EVERY 60 ms