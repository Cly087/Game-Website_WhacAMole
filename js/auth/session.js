/**
 * Checks whether there is an active user through sessionStorage
 * and updates navbar according accordingly. Also has logout
 * functionality.
 */
class AuthSession {
    constructor() {
        this.buttons = {
            login: document.getElementById("login-btn"),
            register: document.getElementById("register-btn"),
            logout: document.getElementById("logout-btn"),
            cta: document.getElementById("cta")
        };

        this.userEmail = sessionStorage.loggedInUsrEmail;
        this.init();
    }

    init() {
        this.buttons.logout.addEventListener("click", () => this.logout());
    }

    // Show/hide nav buttons based on login state
    checkLogin() {
        // Handle Logged-In State
        if (this.userEmail) {
            // Toggle buttons
            this.buttons.login.style.display = "none";
            this.buttons.register.style.display = "none";
            this.buttons.logout.style.display = "inline";
            if (this.buttons.cta) this.buttons.cta.style.display = "none";
        } else {
            this.buttons.login.style.display = "inline";
            this.buttons.register.style.display = "inline";
            this.buttons.logout.style.display = "none";
            if (this.buttons.cta) this.buttons.cta.style.display = "inline";
        }
    }

    // End the session and return to the home page
    logout() {
        window.location.href = "index.html";
        sessionStorage.clear();
    }
}

let authSession;

window.addEventListener('load', () => {
    authSession = new AuthSession();
    authSession.checkLogin();
});