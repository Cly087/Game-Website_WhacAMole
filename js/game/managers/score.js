/**
 * Manages player score and UI updates
 */
export class ScoreManager {
    constructor() {
        this.score = 0;
        this.scoreValEl = document.getElementById("scoreVal");
    }

    getScore() {
        return this.score;
    }

    updateScore(points) {
        this.score = Math.max(0, this.score + points);
        this.scoreValEl.textContent = this.score;
    }

    resetScore() {
        this.score = 0;
        this.scoreValEl.textContent = this.score;
    }
}