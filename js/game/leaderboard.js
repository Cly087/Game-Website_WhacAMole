/**
 * Checks if the current user is logged in and updates their high score
 * in localStorage if their new score is higher than their previous score.
 */
export function recordHighScore(finalScore) {
    const loggedInEmail = sessionStorage.getItem("loggedInUsrEmail");

    if (!loggedInEmail) {
        console.log("User not logged in. Score was not recorded.");
        return;
    }

    const storedUserJson = localStorage.getItem(loggedInEmail);
    if (!storedUserJson) return;

    const user = JSON.parse(storedUserJson);
    const previousScore = user.score;

    if (finalScore > previousScore) {
        user.score = finalScore;
        localStorage.setItem(loggedInEmail, JSON.stringify(user));
        console.log(`New high score for ${user.username}: ${finalScore}`);
    }
}

/**
 * Retrieves all registered users, sorts them by score descending,
 * and returns the top 10.
 */
export function getTopLeaderboard() {
    const users = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const item = JSON.parse(localStorage.getItem(key));

        users.push({
            username: item.username,
            name: item.name,
            score: item.score
        });
    }

    users.sort((a, b) => b.score - a.score);
    return users.slice(0, 10);
}

/**
 * Renders top 10 scores into a <tbody> element on the leaderboard page.
 */
export function renderLeaderboardTable() {
    const tbody = document.querySelector("tbody");
    if (!tbody) return;

    const topUsers = getTopLeaderboard();

    if (topUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No scores recorded yet!</td></tr>`;
        return;
    }

    let html = "";
    for (let i = 0; i < topUsers.length; i++) {
        const user = topUsers[i];
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>${user.username}</td>
                <td>${user.score}</td>
            </tr>
        `;
    }

    tbody.innerHTML = html;
}