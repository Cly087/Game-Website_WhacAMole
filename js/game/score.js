let score = 0;
const scoreValEl = document.getElementById("scoreVal");

export function getScore() {
    return score;
}

// Take and display updated score and floor at 0 if negative
export function updateScore(points) {
    score = Math.max(0, score + points);
    scoreValEl.textContent = score;
}

export function resetScore() {
    score = 0;
    scoreValEl.textContent = score;
}