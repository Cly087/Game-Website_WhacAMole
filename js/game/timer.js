let timeLeft = 5;
let timerInterval = null; // Holds the interval reference so it can be cleared later
const timerValEl = document.getElementById("timerVal");

/**
 * Starts countdown timer
 * Decrements remaining time every second, updates the UI,
 * and executes a callback function when time reaches zero
 */
export function startTimer(onTimesUp) {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerValEl.textContent = timeLeft;

        // Check if countdown reached zero
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            
            // Execute callback if one was provided and is a valid function
            if (typeof onTimesUp === "function") {
                onTimesUp();
            }
        }
    }, 1000);
}

/**
 * Stop active countdown timer by clearing the interval
 */
export function stopTimer() {
    clearInterval(timerInterval);
}