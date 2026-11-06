import { canvas, ctx, FRAME_TIME, FRAME_SIZE } from "./constants.js";
import { SHEETS, SOUNDS, playSound } from "./assets.js";
import { Hole } from "./hole.js";
import { Mole } from "./mole.js";
import { getScore, updateScore } from "./score.js";
import { startTimer } from "./timer.js";
import { recordHighScore } from "./leaderboard.js";

// Disable image smoothing for crisp pixel-art rendering
ctx.imageSmoothingEnabled = false;

// Game state flag
let gameActive = true;

// DOM for Game Over modal
const gameOverModal = document.getElementById("gameOverModal");
const finalScoreVal = document.getElementById("finalScoreVal");
const restartBtn = document.getElementById("restartBtn");

// Display game over popup with the final score
function showGameOverPopup(finalScore) {
    finalScoreVal.textContent = finalScore;
    gameOverModal.style.display = "flex";
}

// Restart button reloads page to reset game state
restartBtn.addEventListener("click", () => {
    window.location.reload();
});

// Initialise timer; triggers game over when time expires
startTimer(() => {
    gameActive = false;
    const finalScore = getScore();
    recordHighScore(finalScore);
    playSound(SOUNDS.roundClear);
    showGameOverPopup(finalScore);
});

// Game loop tracking variables
let current = null; // Currently active mole instance
let last = null;    // Timestamp of the previous frame
let acc = 0;        // Accumulator for updates

// Draw specific frame from a sprite sheet onto the canvas.
function drawFrame(sheet, frame, centerX, centerY) {
    const col = frame % sheet.cols;
    const row = Math.floor(frame / sheet.cols);

    ctx.drawImage(
        sheet.img,
        col * FRAME_SIZE, row * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE,
        centerX - FRAME_SIZE / 2, centerY - FRAME_SIZE / 2, FRAME_SIZE, FRAME_SIZE
    );
}

// Update the game state (spawning moles, updating active mole states)
function updateGame() {
    if (!gameActive) return;

    // If no mole is active or current one is done, spawn new one at random hole
    if (!current || current.state === "empty") {
        const hole = Hole.list[Math.floor(Math.random() * Hole.list.length)];
        current = new Mole(hole);
        current.setState("up");
    } else {
        const prevState = current.state;
        current.update();

        // Penalise player if a mole went back down without being hit
        if (prevState === "idle" && current.state === "down") {
            updateScore(-5);
        }
    }
}

// Render all game elements to the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all hole locations
    for (let i = 0; i < Hole.list.length; i++) {
        Hole.list[i].draw(ctx);
    }

    // Draw the active mole if it's currently visible
    if (current && current.state !== "empty") {
        drawFrame(SHEETS[current.state], current.frame, current.hole.x, current.hole.y);
    }
}

// Main game loop utilising a fixed-timestep pattern with requestAnimationFrame
function loop(now) {
    if (!gameActive) return;

    if (last === null) last = now;
    acc += now - last;
    last = now;

    // Run game updates at a fixed interval
    while (acc >= FRAME_TIME) {
        updateGame();
        acc -= FRAME_TIME;
    }

    draw();
    requestAnimationFrame(loop);
}

// Handle mouse clicks on canvas to detect whacks
canvas.addEventListener("click", event => {
    if (!gameActive) return;

    // Convert click coordinates to match canvas coordinate scaling
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    // Determine which hole was clicked
    let clickedHole = null;
    for (let i = 0; i < Hole.list.length; i++) {
        if (Math.hypot(x - Hole.list[i].x, y - Hole.list[i].y) < Hole.size / 2) {
            clickedHole = Hole.list[i];
            break;
        }
    }

    const m = current;

    if (clickedHole) {
        // If clicked hole has an active mole that can be hit, reward points
        if (m && m.hole === clickedHole && (m.state === "up" || m.state === "idle")) {
            m.setState("hit");
            m.frame = 4;
            updateScore(10);
            playSound(SOUNDS.hit);
        } else {
            // Clicked an empty hole or missed the mole reduces the score
            updateScore(-5);
            playSound(SOUNDS.miss);
        }
    }
});

// Wait for assets to load before setting up grid rows and starting the game loop
SHEETS.hole.img.onload = () => {
    Hole.addRow(3, 64, 90);
    Hole.addRow(4, 32, 144);

    requestAnimationFrame(loop);
};