/**
 * Constants
 */
const CELL_WIDTH = 101;
const CELL_HEIGHT = 83;

// Enemies our player must avoid
const Enemy = function(
    startX = 0, startY = -35,
    speed = 10,
    sprite = 'images/enemy-bug.png'
) {
    this.x = startX;
    this.y = startY;
    this.speed = speed;
    this.sprite = sprite;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(
    startX = 0, startY = -35,
    sprite = 'images/char-boy.png'
) {
    this.x = startX;
    this.y = startY;
    this.sprite = sprite;
};

Player.prototype.update = function() {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    let message = `Key pressed: ${key}`
    console.log(message);

    const horStep = 101;
    const vertStep = 83;

    const newPos = {
        x: this.x,
        y: this.y
    };

    switch(key) {
        case 'left':
            newPos.x -= horStep;
            break;
        case 'up':
            newPos.y -= vertStep;
            break;
        case 'right':
            newPos.x += horStep;
            break;
        case 'down':
            newPos.y += vertStep;
            break;
        default:
            // Do nothing
            break;
    };

    if (isInside(newPos)) {
        this.x = newPos.x;
        this.y = newPos.y;
    }

    message = `Current position: (${this.x}, ${this.y})`;
    console.log(message);
};

function isInside(pos) {
    const inside = pos.x >= 0 && pos.x <= 404
            && pos.y >= -35 && pos.y <= 380;
    return inside;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [
    new Enemy(),
    new Enemy()
];

// Places the player in the (0, 0) cell
let playerStartX = 0;
let playerStartY = -35;

// Moves to cell (2, 5)
playerStartX += CELL_WIDTH * 2;
playerStartY += CELL_HEIGHT * 5;

const player = new Player(playerStartX, playerStartY);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
