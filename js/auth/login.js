/**
 * Checks user inputs against localStorage to see if it exists and
 * checks the associated password if it does.
*/
class UserLogin {
    constructor() {
        this.inputs = {
            email: document.getElementById("email"),
            password: document.getElementById("password")
        };

        this.errors = {
            email: document.getElementById("email-error"),
            password: document.getElementById("password-error")
        };

        this.result = document.getElementById("result");

        this.loginH1 = document.getElementById("login-h1");
        this.form = document.querySelector(".form");
        this.paragraph = document.querySelector("div + p");

        this.submitBtn = document.getElementById("submit-btn");

        this.init();
    }

    // Initialise event listeners
    init() {
        this.submitBtn.addEventListener("click", () => this.login());
    }

    // Validate credentials then start a session if they pass all checks
    login() {
        // Clear Errors and Previous Result
        this.errors.email.textContent = "";
        this.errors.password.textContent = "";
        this.result.textContent = "";

        const data = this.getFormData();

        // User Existence Check
        const user = this.getUser(data.email);
        if (!user) {
            console.log("Login failed. User not found.");
            return;
        }

        // Password Check
        if (!this.verifyPassword(user, data.password)) {
            console.log("Login failed. Incorrect password.");
            return;
        }

        // Start session
        this.startSession(user);
    }

    // ---------- HELPERS ----------
    // Get inputs values
    getFormData() {
        return {
            email: this.inputs.email.value,
            password: this.inputs.password.value
        };
    }

    // Fetch user from localStorage (returns null if not found)
    getUser(email) {
        const storedUser = localStorage.getItem(email);

        if (!storedUser) {
            this.errors.email.textContent = "Email not recognised. Do you have an account?";
            return null;
        }

        return JSON.parse(storedUser);
    }

    // Check the entered password against the stored one
    verifyPassword(user, password) {
        if (password !== user.password) {
            this.errors.password.textContent = "Password not correct. Please try again.";
            return false;
        }
        return true;
    }

    // Save session state, update the page, then redirect
    startSession(user) {
        sessionStorage.setItem("loggedInUsrEmail", user.email);
        this.result.textContent = "Login successful! Redirecting...";

        this.showWelcome(user);

        setTimeout(() => {
            window.location.href = "game.html";
        }, 1000);

        console.log("Successfully logged in user.");
    }

    // Replace the login form with a welcome message
    showWelcome(user) {
        this.loginH1.textContent = `Welcome, ${user.name}!`;
        this.form.innerHTML = "";
        this.paragraph.innerHTML = "";
    }
}

let userLogin;

window.addEventListener("load", () => userLogin = new UserLogin());