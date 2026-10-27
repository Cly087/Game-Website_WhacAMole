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

    // Helper to get inputs values
    getFormData() {
        return {
            name: this.inputs.name.value,
            username: this.inputs.username.value,
            email: this.inputs.email.value,
            password: this.inputs.password.value
        };
    }

    // Helper for regex format rules
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

    // Helper to check if user already exists
    isUnique(email) {
        if (localStorage.getItem(email)) {
            this.errors.email.textContent = "An account with this email address already exists.";
            return false;
        }
        return true;
    }

    // Helper to writing to localStorage
    storeUser(user) {
        localStorage.setItem(user.email, JSON.stringify(user));
        this.result.textContent = "Registration successful!";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

        console.log("Successfully stored user.");
    }
}

window.onload = checkLogin;

function checkLogin() {
    const userEmail = sessionStorage.loggedInUsrEmail;

    const loginH1 = document.getElementById("login-h1");

    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const logoutBtn = document.getElementById("logout-btn");

    // Handle Logged-In State
    if (userEmail) {
        // Toggle buttons
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline";

    } else {
        if (loginH1) loginH1.textContent = "Log In";
        if (loginBtn) loginBtn.style.display = "inline";
        if (registerBtn) registerBtn.style.display = "inline";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

function login() {
    // Get values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const emailError = document.getElementById("email-error");
    const passError = document.getElementById("password-error");
    const successElement = document.getElementById("result");

    const loginH1 = document.getElementById("login-h1");
    const form = document.querySelector(".form");
    const paragraph = document.querySelector("div + p");
    
    // Clear previous feedback messages
    emailError.textContent = "";
    passError.textContent = "";
    successElement.textContent = "";

    // Check if email exists in localStorage
    const storedUser = localStorage.getItem(email);

    if (!storedUser) {
        if (emailError) {
            emailError.textContent = "Email not recognised. Do you have an account?";
        }
        return;
    }

    // Parse the stored user object
    const usrObj = JSON.parse(storedUser);

    // Verify password
    if (password === usrObj.password) {
        // Successful login
        if (successElement) {
            successElement.textContent = "Login successful! Redirecting...";
        }

        // Save session state
        sessionStorage.loggedInUsrEmail = usrObj.email;

        if (storedUser) {
            const usrObj = JSON.parse(storedUser);
            if (loginH1) loginH1.textContent = `Welcome, ${usrObj.name}!`;
            
            // Clear forms/paragraphs
            if (form) form.innerHTML = "";
            if (paragraph) paragraph.innerHTML = "";
        }

        // Automatically redirect to the game page after 1 second
        setTimeout(() => {
            window.location.href = "game.html";
        }, 1000);

    } else {
        if (passError) {
            passError.textContent = "Password not correct. Please try again.";
        }
    }
}

// Initialize the user registration and login functionality
const register = new UserRegistration();
