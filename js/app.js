/******************************************************************************
 * Constants
 *****************************************************************************/
const CELL_WIDTH = 101;
const CELL_HEIGHT = 83;

const GRID_ROWS = 6;
const GRID_COLUMNS = 5;

const PLAYER_OFFSET_X = 0;
const PLAYER_OFFSET_Y = -35;

const ENEMY_COUNT = 3;

const ENEMY_OFFSET_X = 0;
const ENEMY_OFFSET_Y = -35;

const ENEMY_MAX_X = 505;
const ENEMY_MIN_SPEED = 200;
const ENEMY_MAX_SPEED = 500;

const COLLISION_RADIUS = 20;

/******************************************************************************
 * Enemy
 *****************************************************************************/
const Enemy = function(
    sprite = 'images/enemy-bug.png'
) {
    this.x = ENEMY_OFFSET_X;
    this.y = ENEMY_OFFSET_Y;
    this.sprite = sprite;

    this.reset();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    this.x += this.speed * dt;

    if (this.x > ENEMY_MAX_X) {
        this.reset();
    }

    // Check collison with player
    const playerPos = {
        x: player.x, y: player.y
    };
    const enemyPos = {
        x: this.x, y: this.y
    };
    if (isColliding(playerPos, enemyPos, COLLISION_RADIUS)) {
         player.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {

    this.speed = ENEMY_MIN_SPEED + Math.random() * (ENEMY_MAX_SPEED - ENEMY_MIN_SPEED + 1);

    const startCellI = getRandomInt(1, 3); // Random stone row
    const startCellJ = -1; // Starts to the left of the screen
    const newPos = getPositionFromCell(startCellI, startCellJ, ENEMY_OFFSET_X, ENEMY_OFFSET_Y);

    this.x = newPos.x;
    this.y = newPos.y;
};

/******************************************************************************
 * Player
 *****************************************************************************/
const Player = function(
    sprite = 'images/char-boy.png'
) {
    this.x = PLAYER_OFFSET_X;
    this.y = PLAYER_OFFSET_Y;
    this.gridJ = 0;
    this.gridI = 0;
    this.sprite = sprite;
};

Player.prototype.update = function() {

    // Check winning condition
    if (this.gridI === 0) {
        this.reset();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {

    let message = `Key pressed: ${key}`
    console.log(message);

    const newGridPos = {
        j: this.gridJ,
        i: this.gridI
    };

    switch(key) {
        case 'left':
            newGridPos.j--;
            break;
        case 'up':
            newGridPos.i--;
            break;
        case 'right':
            newGridPos.j++;
            break;
        case 'down':
            newGridPos.i++;
            break;
        default:
            // Do nothing
            break;
    };

    this.moveToGridCell(newGridPos.i, newGridPos.j);

    message = `Current position: (${this.x}, ${this.y})`;
    console.log(message);
};

Player.prototype.reset = function() {
    this.moveToGridCell(5, 2);
};

Player.prototype.moveToGridCell = function(i, j) {

    if (isWithinGrid(i, j)) {
        this.gridI = i;
        this.gridJ = j;
        const newPos = getPositionFromCell(i, j, PLAYER_OFFSET_X, PLAYER_OFFSET_Y);
        this.x = newPos.x;
        this.y = newPos.y;
    }
};

/******************************************************************************
 * Utils
 *****************************************************************************/

function getPositionFromCell(i, j, offsetX, offsetY) {

    let x = j * CELL_WIDTH + offsetX;
    let y = i * CELL_HEIGHT + offsetY;

    return {
        x, y
    };
}

function isWithinGrid(i, j) {
    const within = i >= 0 && i <= GRID_ROWS-1
            && j >= 0 && j <= GRID_COLUMNS-1;
    return within;
};

function getRandomInt(min, max) {
    return Math.floor(min + Math.random() * Math.floor(max - min + 1));
};

function isColliding(posA, posB, radius) {
    const dx = posB.x - posA.x;
    const dy = posB.y - posA.y;
    return (dx * dx) + (dy * dy) < (2 * radius * radius);
};

/******************************************************************************
 * Setup
 *****************************************************************************/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [];
for (let i = 0; i < ENEMY_COUNT; i++) {
    allEnemies[i] = new Enemy();
}

// Place the player object in a variable called player
const player = new Player();

// Places the player in the (5, 2) cell
player.moveToGridCell(5, 2);

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
