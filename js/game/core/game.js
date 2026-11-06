import { canvas, ctx, FRAME_TIME } from "./constants.js";
import { Renderer } from "./renderer.js";
import { InputHandler } from "./input.js";

import { Hole } from "../entities/hole.js";
import { Mole } from "../entities/mole.js";

import { SHEETS, SOUNDS, playSound } from "../managers/assets.js";
import { ScoreManager } from "../managers/score.js";
import { Timer } from "../managers/timer.js";
import { Leaderboard } from "../managers/leaderboard.js";

/**
 * Runs the main game logic
 */
export class Game {
    constructor() {
        this.gameActive = true; // Game state flag

        // Create objects to access its methods
        this.scoreManager = new ScoreManager();
        this.timer = new Timer(5, () => this.handleGameOver());
        this.renderer = new Renderer(ctx, canvas);
        this.inputHandler = new InputHandler(canvas, this);

        this.current = null;
        this.last = 0; // Stores the timestamp of the last executed frame
    }

    handleGameOver() {
        this.gameActive = false;
        const finalScore = this.scoreManager.getScore();
        Leaderboard.recordHighScore(finalScore);
        playSound(SOUNDS.roundClear);

        // DOM for Game Over modal
        const finalScoreVal = document.getElementById("finalScoreVal");
        const gameOverModal = document.getElementById("gameOverModal");

        // Display game over popup with the final score
        finalScoreVal.textContent = finalScore;
        gameOverModal.style.display = "flex";
    }

    // Wait for assets to load before setting up grid rows and starting the game loop
    start() {
        SHEETS.hole.img.onload = () => {
            Hole.addRow(3, 64, 90);
            Hole.addRow(4, 32, 144);
            this.timer.start();
            requestAnimationFrame(now => this.loop(now));
        };
    }

    // Update the game state (spawning moles, updating active mole states)
    updateGame() {
        if (!this.gameActive) return;

        // If no mole is active or current one is done, spawn new one in a random hole
        if (!this.current || this.current.state === "empty") {
            const hole = Hole.list[Math.floor(Math.random() * Hole.list.length)];
            this.current = new Mole(hole);
            this.current.setState("up");
        } else {
            const prevState = this.current.state;
            this.current.update();

            // Penalise player if a mole went back down without being hit
            if (prevState === "idle" && this.current.state === "down") {
                this.scoreManager.updateScore(-5);
            }
        }
    }

    loop(now) {
        if (!this.gameActive) return;

        // Calculate how much time passed since last loop execution
        const msPassed = now - this.last;

        // If 100ms hasn't passed yet, skip the rest of the code and wait
        if (msPassed < FRAME_TIME) {
            requestAnimationFrame(now => this.loop(now));
            return;
        }

        const excessTime = msPassed % FRAME_TIME;   // Calculate any excess millisecond drift
        this.last = now - excessTime;               // Update the "last" clock, subtracting the drift so timer stays accurate

        // Run the game updates and render exactly once
        this.updateGame();
        this.renderer.render(this.current);

        requestAnimationFrame(now => this.loop(now));   // Queue the next animation frame
    }
}