import { NEXT } from "../core/constants.js";
import { SHEETS } from "../managers/assets.js";

/**
 * Represents the mole entity and manages its animation states
 */
export class Mole {
    constructor(hole) {
        this.hole = hole;
        this.state = "empty";
        this.frame = 0;
    }

    // Change mole's current state and reset animation tracking variables
    setState(state) {
        this.state = state;
        this.frame = 0;
    }

    // Update animation frame tracking, loop idle states, or progress down the state chain.
    update() {
        this.frame++;
        if (this.frame < SHEETS[this.state].frames) return;

        if (this.state === "idle") {
            this.frame = 0;
            this.setState("down");
        } else {
            this.setState(NEXT[this.state]);
        }
    }
}