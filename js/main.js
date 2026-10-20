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
        // Clear Errors
        this.errors.name.innerHTML = "";
        this.errors.username.innerHTML = "";
        this.errors.email.innerHTML = "";
        this.errors.password.innerHTML = "";

        const data = this.getFormData();

        // Form hecks
        if (!this.validateFormats(data)) {
            console.log("Format validation failed.");
            return;
        }

        // User Uniqueness Checks
        if (!this.isUnique(data.username, data.email)) {
            console.log("Uniqueness validation failed.");
            return;
        }

        // Store user
        this.storeUser(data);
    }

    // Helper to get inputs value
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
            this.errors.name.innerHTML = "<p>Letters, spaces, hyphens (-), and apostrophes (') only.</p>";
            isValid = false;
        }
        if (!this.REGEX.username.test(data.username)) {
            this.errors.username.innerHTML = "<p>3-20 chars: Letters, numbers, periods (.), hyphens (-), and underscores (_) only.</p>";
            isValid = false;
        }
        if (!this.REGEX.email.test(data.email)) {
            this.errors.email.innerHTML = "<p>Enter a valid email address.</p>";
            isValid = false;
        }
        if (!this.REGEX.password.test(data.password)) {
            this.errors.password.innerHTML = "<p>Min. 8 chars: 1 uppercase, 1 lowercase, 1 digit, 1 special character.</p>";
            isValid = false;
        }

        return isValid;
    }

    // Helper to check if user already exists
    isUnique(username, email) {
        let isValid = true;
        
        if (localStorage.getItem(username)) {
            this.errors.username.innerHTML = "<p>Username taken.</p>"
            isValid = false;
        }

        if (localStorage.getItem(email)) {
            this.errors.email.innerHTML = "<p>An account with this email address already exists.</p>";
            isValid = false;
        }

        return isValid;
    }

    // Helper to writing to localStorage
    storeUser(user) {
        localStorage.setItem(user.email, JSON.stringify(user));
        this.result.innerHTML = "<p>Registration successful!</p>";
        console.log("Successfully stored user.");
    }
}

const register = new UserRegistration();
