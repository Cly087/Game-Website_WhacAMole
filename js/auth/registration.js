/** 
 * - Validates user registration and stores them to localStorage.
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
        this.submitBtn = document.getElementById("submit-btn");

        this.init();
    }

    // When button pressed, run main logic
    init() {
        this.submitBtn.addEventListener("click", () => this.validate());
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
    getFormData() {
        return {
            name: this.inputs.name.value,
            username: this.inputs.username.value,
            email: this.inputs.email.value,
            password: this.inputs.password.value
        };
    }

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

    isUnique(email) {
        if (localStorage.getItem(email)) {
            this.errors.email.textContent = "An account with this email address already exists.";
            return false;
        }
        return true;
    }

    storeUser(user) {
        localStorage.setItem(user.email, JSON.stringify(user));
        this.result.textContent = "Registration successful!";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

        console.log("Successfully stored user.");
    }
}

// Initialise the user registration functionality
const register = new UserRegistration();