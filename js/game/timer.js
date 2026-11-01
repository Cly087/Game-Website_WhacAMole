let timeLeft = 5;
let timerInterval = null;
const timerValEl = document.getElementById("timerVal");

export function startTimer(onTimesUp) {
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timerValEl) {
            timerValEl.textContent = timeLeft;
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (typeof onTimesUp === "function") {
                onTimesUp();
            }
        }
    }, 1000);
}

export function stopTimer() {
    clearInterval(timerInterval);
}