/**
 * Manages the countdown timer and UI updates
 */
export class Timer {
    constructor(duration, onTimesUp) {
        this.timeLeft = duration;
        this.timerInterval = null;
        this.timerValEl = document.getElementById("timerVal");
        this.onTimesUp = onTimesUp;
    }

    // Starts countdown timer
    start() {
        this.timerValEl.textContent = this.timeLeft;

        // Decrements remaining time every second
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerValEl.textContent = this.timeLeft;

            // If countdown reached zero, run onTimesUp (handleGameOver in game.js)
            if (this.timeLeft <= 0) {
                this.stop();
                this.onTimesUp();
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.timerInterval);
    }
}