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
 * Character
 *****************************************************************************/

 /**
 * @description Characters are elements of the game that are drawn as a sprite
 * and have a position on the screen.
 * @constructor
 * @param {string} sprite - The path to the sprite to be used to draw
 * this character.
 */
const Character = function(sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};

/**
 * @description Draws the player image on the screen.
 */
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/******************************************************************************
 * Enemy
 *****************************************************************************/

/**
 * @description Enemies run through stone rows from left to right.
 * When an enemy reaches the end of the screen, its position is reset,
 * to give the impression that it is a new enemy.
 * @constructor
 * @param {string} sprite - The path to the sprite to be used to draw
 * this enemy.
 */
const Enemy = function(
    sprite = 'images/enemy-bug.png'
) {
    Character.call(this, sprite, ENEMY_OFFSET_X, ENEMY_OFFSET_Y);
    this.reset();
};

/**
 * Make Enemy inherit methods and properties from Character.
 */
Enemy.prototype = Object.create(Character.prototype);

/**
 * @description Updates the enemy position, based on 'dt', and checks for
 * collision with the player.
 * @param {number} dt - A time delta between ticks.
 */
Enemy.prototype.update = function(dt) {

    this.x += this.speed * dt;

    // If the enemy has left the screen, reset it
    if (this.x > ENEMY_MAX_X) {
        this.reset();
        return;
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

/**
 * @description Resets the enemy to the left of the screen and assigns
 * a random stone row for it to run on.
 */
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

 /**
 * @description The player can move through the screen in four directions
 * (up, right, down, left).
 * Once it reaches a water block, its position is reset to a grass block.
 *
 * @constructor
 * @param {string} sprite - The path to the sprite to be used to draw
 * the player.
 */
const Player = function(
    sprite = 'images/char-boy.png'
) {
    Character.call(this, sprite, PLAYER_OFFSET_X, PLAYER_OFFSET_Y);
    this.gridJ = 0;
    this.gridI = 0;
};

/**
 * Make Player inherit methods and properties from Character.
 */
Player.prototype = Object.create(Character.prototype);

/**
 * @description Updates the position of the player based on the last
 * movement triggered by the user. Also checks whether the player has
 * reached a water block.
 */
Player.prototype.update = function() {

    // Check winning condition
    if (this.gridI === 0) {
        this.reset();
    }
};

/**
 * @description Sets the player's grid coordinates based on the keys
 * that the user presses.
 * @param {string} key - A string representing the key that was pressed.
 */
Player.prototype.handleInput = function(key) {

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
};

/**
 * @description Resets the player to a grass block.
 */
Player.prototype.reset = function() {
    this.moveToGridCell(5, 2);
};

/**
 * @description Updates the 'x' and 'y' coordinates based on a grid coordinate.
 * @param {number} i - The row of the cell.
 * @param {number} j - The column of the cell.
 */
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

 /**
  * @description Converts from grid to cartesian coordinates, based on the
  * default cell dimensions, and adjusts by a given offset.
  * @param {number} i - The row of the cell.
  * @param {number} j - The column of the cell.
  * @param {number} offsetX - The horizontal offset.
  * @param {number} offsetY - The vertical offset.
  * @returns {object} An object with the 'x' and 'y' coordinates.
  */
function getPositionFromCell(i, j, offsetX, offsetY) {

    let x = j * CELL_WIDTH + offsetX;
    let y = i * CELL_HEIGHT + offsetY;

    return {
        x, y
    };
}

/**
 * @description Checks whether the given grid coordinates for a cell
 * are within the limits of the grid.
 * @param {number} i - The row of the cell.
 * @param {number} j - The column of the cell.
 * @returns {boolean} <code>true</code> if the cell is within the grid, <code>false</code> otherwise.
 */
function isWithinGrid(i, j) {
    const within = i >= 0 && i <= GRID_ROWS-1
            && j >= 0 && j <= GRID_COLUMNS-1;
    return within;
}

/**
 * @description Gives a random integer number in the closed interval [min, max].
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A number between 'min' and 'max'.
 */
function getRandomInt(min, max) {
    return Math.floor(min + Math.random() * Math.floor(max - min + 1));
}

/**
 * @description Checks whether two objects, A and B, are colliding, given
 * their centers and a collision radius.
 * @param {number} posA - The center of object A.
 * @param {number} posB - The center of object B.
 * @param {number} radius - The radius of collision around the centers
 * of objects A and B.
 * @returns {boolean} <code>true</code> if the two objects are colliding, <code>false</code> otherwise.
 */
function isColliding(posA, posB, radius) {
    const dx = posB.x - posA.x;
    const dy = posB.y - posA.y;
    return (dx * dx) + (dy * dy) < (2 * radius * radius);
}

/******************************************************************************
 * Setup
 *****************************************************************************/

// Create enemies
const allEnemies = [];
for (let i = 0; i < ENEMY_COUNT; i++) {
    allEnemies[i] = new Enemy();
}

// Create player
const player = new Player();

// Moves the player to its initial block
player.moveToGridCell(5, 2);

// Listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
