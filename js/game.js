// It's going to be 8 FPS, and some sprites have an empty last frame. The hit sprite has frames 0-1 as 
// thwack, 2-3 as pow, and 4-5 as ouch, with the last frames 6-7 revealing stars over the mole. I plan
// to randomly select thwack, pow, or ouch as the starting animations and continue with frames 6-7.

// The other sprites have the following: 
// Bomb: 11 frames, 3 cols
// Down: 4 frames, 2 cols
// Hole: 1 frame;
// Idle: 10 frames, 3 cols
// Up: 5 frames, 2 cols

// I was thinking of chaining these animations to describe the mole's current state. For the bomb, it
// will be for the 'hard' difficulty where other than speeding up, it involves ending the game or 
// maybe adding it to a strike count (max. 3).

// empty -> up -> idle (loops) -> down -> empty
//           \-> (clicked) -> hit -> down -> empty

"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

function loadSprite(src, frames, cols) {
    const img = new Image();
    img.src = src;
    return { img, frames, cols };
}

const SHEETS = {
    bomb: loadSprite("../assets/sprites/hole.png", 11, 3),
    down: loadSprite("../assets/sprites/down.png", 4, 2),
    hole: loadSprite("../assets/sprites/hole.png", 1, 1),
    idle: loadSprite("../assets/sprites/idle.png", 10, 3),
    up: loadSprite("../assets/sprites/up.png", 5, 2)
}

/**
 * Draws and positions holes onto the canvas
 */
class Hole {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 32;
    }

    draw() {
        ctx.drawImage(
            SHEETS.hole.img,
            this.x - this.size / 2,
            this.y - this.size / 2
        );
    }
}

const holes = [];
const spacing = 64;

function addRow(count, startX, y) {
    for (let i = 0; i < count; i++) {
        holes.push(new Hole(startX + i * spacing, y));
    }
}

// Upper row: 3 holes; Lower row: 4 holes
addRow(3, 64, 90);
addRow(4, 32, 144);

// Redraws the whole scene, running continuously
function drawGame() {
    for (let i = 0; i < holes.length; i++) {
        holes[i].draw();
    }

    window.requestAnimationFrame(drawGame);
}

drawGame();