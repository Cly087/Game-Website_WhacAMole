import { FRAME_SIZE } from "../core/constants.js";
import { SHEETS } from "../managers/assets.js";
import { Hole } from "../entities/hole.js";

/**
 * Handles Canvas visual elements and sprite sheets.
 */
export class Renderer {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draw specific frame from a sprite sheet onto the canvas.
    drawFrame(sheet, frame, centerX, centerY) {
        const col = frame % sheet.cols;
        const row = Math.floor(frame / sheet.cols);

        this.ctx.drawImage(
            sheet.img,
            col * FRAME_SIZE, row * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE,
            centerX - FRAME_SIZE / 2, centerY - FRAME_SIZE / 2, FRAME_SIZE, FRAME_SIZE
        );
    }

    // Render all game elements to the canvas
    render(currentMole) {
        this.clear();

        // Draw holes
        for (let i = 0; i < Hole.list.length; i++) {
            Hole.list[i].draw();
        }

        // Draw active mole
        if (currentMole && currentMole.state !== "empty") {
            this.drawFrame(SHEETS[currentMole.state], currentMole.frame, currentMole.hole.x, currentMole.hole.y);
        }
    }
}