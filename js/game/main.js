import { canvas, ctx, FRAME_TIME, FRAME_SIZE } from "./constants.js";
import { SHEETS } from "./assets.js";
import { Hole } from "./hole.js";
import { Mole } from "./mole.js";
import { getScore, updateScore } from "./score.js";
import { startTimer } from "./timer.js";

ctx.imageSmoothingEnabled = false;

let gameActive = true;

const gameOverModal = document.getElementById("gameOverModal");
const finalScoreVal = document.getElementById("finalScoreVal");
const restartBtn = document.getElementById("restartBtn");

function showGameOverPopup(finalScore) {
    finalScoreVal.textContent = finalScore;
    gameOverModal.style.display = "flex";
}

restartBtn.addEventListener("click", () => {
    window.location.reload();
});

startTimer(() => {
    gameActive = false;
    showGameOverPopup(getScore());
});

let current = null;
let last = null;
let acc = 0;

function drawFrame(sheet, frame, centerX, centerY) {
    const col = frame % sheet.cols;
    const row = Math.floor(frame / sheet.cols);

    ctx.drawImage(
        sheet.img,
        col * FRAME_SIZE, row * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE,                 
        centerX - FRAME_SIZE / 2, centerY - FRAME_SIZE / 2, FRAME_SIZE, FRAME_SIZE 
    );
}

function updateGame() {
    if (!gameActive) return;

    if (!current || current.state === "empty") {
        const hole = Hole.list[Math.floor(Math.random() * Hole.list.length)];
        current = new Mole(hole);
        current.setState("up");
    } else {
        const prevState = current.state;
        current.update();

        if (prevState === "idle" && current.state === "down") {
            updateScore(-5);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < Hole.list.length; i++) {
        Hole.list[i].draw(ctx);
    }

    if (current && current.state !== "empty") {
        drawFrame(SHEETS[current.state], current.frame, current.hole.x, current.hole.y);
    }
}

function loop(now) {
    if (!gameActive) return;

    if (last === null) last = now;
    acc += now - last;
    last = now;

    while (acc >= FRAME_TIME) {
        updateGame();
        acc -= FRAME_TIME;
    }

    draw();
    requestAnimationFrame(loop);
}

canvas.addEventListener("click", event => {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    let clickedHole = null;
    for (let i = 0; i < Hole.list.length; i++) {
        if (Math.hypot(x - Hole.list[i].x, y - Hole.list[i].y) < Hole.size / 2) {
            clickedHole = Hole.list[i];
            break;
        }
    }

    const m = current;
    
    if (clickedHole) {
        if (m && m.hole === clickedHole && (m.state === "up" || m.state === "idle")) {
            m.setState("hit");
            m.frame = 4;
            updateScore(10);
        } else {
            updateScore(-5);
        }
    }
});

SHEETS.hole.img.onload = () => {
    Hole.addRow(3, 64, 90);     
    Hole.addRow(4, 32, 144);    

    requestAnimationFrame(loop);
};