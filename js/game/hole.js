import { ctx } from "./constants.js";
import { SHEETS } from "./assets.js";

/** 
 * Represents a hole on the grid where moles can appear.
 */
export class Hole {
    static list = [];
    static spacing = 64;
    static size = 32;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Draw hole centered at its coordinates
    draw() {
        ctx.drawImage(
            SHEETS.hole.img,
            this.x - Hole.size / 2,
            this.y - Hole.size / 2
        );
    }

    // Generate rows and draw them
    static addRow(count, startX, y) {
        for (let i = 0; i < count; i++) {
            const newHole = new Hole(startX + i * Hole.spacing, y);

            Hole.list.push(newHole);

            newHole.draw();
        }
    }
}