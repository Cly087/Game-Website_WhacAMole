"use strict";

/** 
 * Validates user registration and stores them to localStorage.
 */
class UserRegistration {
    REGEX = {
        name: /^\p{L}+(?:[ '’-]\p{L}+)*$/u,
        username: /^(?=.{3,20}$)[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
    };

    constructor() {
        this.inputs = {
            name: document.getElementById("name"),
            username: document.getElementById("username"),
            email: document.getElementById("email"),
            password: document.getElementById("password")
        };

        this.errors = {
            name: document.getElementById("name-error"),
            username: document.getElementById("username-error"),
            email: document.getElementById("email-error"),
            password: document.getElementById("password-error")
        };

        this.result = document.getElementById("result");
    }

    // Validate user then store if it passes all checks
    validate() {
        // Clear Errors and Previous Result
        this.errors.name.textContent = "";
        this.errors.username.textContent = "";
        this.errors.email.textContent = "";
        this.errors.password.textContent = "";
        this.result.textContent = "";

        const data = this.getFormData();

        // Form Checks
        if (!this.validateFormats(data)) {
            console.log("Format validation failed.");
            return;
        }

        // User Uniqueness Checks
        if (!this.isUnique(data.email)) {
            console.log("Uniqueness validation failed.");
            return;
        }

        // Store user
        this.storeUser(data);
    }

    // ---------- HELPERS ----------
    // Get inputs values
    getFormData() {
        return {
            name: this.inputs.name.value,
            username: this.inputs.username.value,
            email: this.inputs.email.value,
            password: this.inputs.password.value
        };
    }

    // Regex format rules
    validateFormats(data) {
        let isValid = true;

        if (!this.REGEX.name.test(data.name)) {
            this.errors.name.textContent = "Letters, spaces, hyphens (-), and apostrophes (') only.";
            isValid = false;
        }
        if (!this.REGEX.username.test(data.username)) {
            this.errors.username.textContent = "3-20 chars: Letters, numbers, periods (.), hyphens (-), and underscores (_) only.";
            isValid = false;
        }
        if (!this.REGEX.email.test(data.email)) {
            this.errors.email.textContent = "Enter a valid email address.";
            isValid = false;
        }
        if (!this.REGEX.password.test(data.password)) {
            this.errors.password.textContent = "Min. 8 chars: 1 uppercase, 1 lowercase, 1 digit, 1 special character.";
            isValid = false;
        }

        return isValid;
    }

    // Check if user already exists
    isUnique(email) {
        if (localStorage.getItem(email)) {
            this.errors.email.textContent = "An account with this email address already exists.";
            return false;
        }
        return true;
    }

    // Write user to localStorage
    storeUser(user) {
        localStorage.setItem(user.email, JSON.stringify(user));
        this.result.textContent = "Registration successful!";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

        console.log("Successfully stored user.");
    }
}

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

        // Elements changed on successful login
        this.loginH1 = document.getElementById("login-h1");
        this.form = document.querySelector(".form");
        this.paragraph = document.querySelector("div + p");
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
            console.log("Login failed: user not found.");
            return;
        }

        // Password Check
        if (!this.verifyPassword(user, data.password)) {
            console.log("Login failed: incorrect password.");
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
        if (this.loginH1) this.loginH1.textContent = `Welcome, ${user.name}!`;
        if (this.form) this.form.innerHTML = "";
        if (this.paragraph) this.paragraph.innerHTML = "";
    }
}

/**
 * Checks whether there is an active user through sessionStorage.
 */
class AuthSession {
    constructor() {
        this.buttons = {
            login: document.getElementById("login-btn"),
            register: document.getElementById("register-btn"),
            logout: document.getElementById("logout-btn")
        };

        this.userEmail = sessionStorage.loggedInUsrEmail;
    }

    // Show/hide nav buttons based on login state
    checkLogin() {
        // Handle Logged-In State
        if (this.userEmail) {
            // Toggle buttons
            this.buttons.login.style.display = "none";
            this.buttons.register.style.display = "none";
            this.buttons.logout.style.display = "inline";

        } else {
            this.buttons.login.style.display = "inline";
            this.buttons.register.style.display = "inline";
            this.buttons.logout.style.display = "none";
        }
    }

    // End the session and return to the home page
    logout() {
        sessionStorage.clear();
        window.location.href = "index.html";
    }
}

// Initialise the user registration and login functionality
const register = new UserRegistration();

let userLogin;
let authSession;

window.onload = () => {
    userLogin = new UserLogin();
    authSession = new AuthSession();
    authSession.checkLogin();
};