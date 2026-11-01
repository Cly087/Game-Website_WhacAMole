let score = 0;
const scoreValEl = document.getElementById("scoreVal");

export function getScore() {
    return score;
}

export function updateScore(points) {
    score = Math.max(0, score + points);
    if (scoreValEl) {
        scoreValEl.textContent = score;
    }
}

export function resetScore() {
    score = 0;
    if (scoreValEl) {
        scoreValEl.textContent = score;
    }
}