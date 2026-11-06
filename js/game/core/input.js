import { Hole } from "../entities/hole.js";
import { SOUNDS, playSound } from "../managers/assets.js";

/**
 * Handles game interactivity by listening to Canvas mouse clicks
 */
export class InputHandler {
    constructor(canvas, gameInstance) {
        this.canvas = canvas;
        this.game = gameInstance;

        this.initClickEvents();
        this.initModalEvents();
    }

    // Handle mouse clicks on canvas to detect whacks
    initClickEvents() {
        this.canvas.addEventListener("click", event => {
            if (!this.game.gameActive) return;

            // Convert click coordinates to match canvas coordinate scaling
            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (event.clientY - rect.top) * (this.canvas.height / rect.height);

            // Determine which hole was clicked
            let clickedHole = null;
            for (let i = 0; i < Hole.list.length; i++) {
                if (Math.hypot(x - Hole.list[i].x, y - Hole.list[i].y) < Hole.size / 2) {
                    clickedHole = Hole.list[i];
                    break;
                }
            }

            const m = this.game.current;

            if (clickedHole) {
                // If clicked hole has an active mole that can be hit, reward points
                if (m && m.hole === clickedHole && (m.state === "up" || m.state === "idle")) {
                    m.setState("hit");
                    m.frame = 4;
                    this.game.scoreManager.updateScore(10);
                    playSound(SOUNDS.hit);
                } else {
                    // Clicked an empty hole or missed the mole reduces the score
                    this.game.scoreManager.updateScore(-5);
                    playSound(SOUNDS.miss);
                }
            }
        });
    }

    // Restart button reloads page to reset game state
    initModalEvents() {
        const restartBtn = document.getElementById("restartBtn");
        restartBtn.addEventListener("click", () => window.location.reload());
    }
}