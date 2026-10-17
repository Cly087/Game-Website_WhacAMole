// ==== REGISTRATION ====
const nameRegex = /^\p{L}+(?:[ '’-]\p{L}+)*$/u;
const usernameRegex = /^(?=.{3,20}$)[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d\W]{8,}$/;

function register() {
    // Extract data from input fields
    const name = document.querySelector("#name").value;
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // Reference to error IDs
    const nameError = document.querySelector("#name-error");
    nameError.innerHTML = "";
    const usernameError = document.querySelector("#username-error");
    usernameError.innerHTML = "";
    const emailError = document.querySelector("#email-error");
    emailError.innerHTML = "";
    const passwordError = document.querySelector("#password-error");
    passwordError.innerHTML = "";

    let isValid = true;

    // Register Conditions
    if (!nameRegex.test(name)) {
        nameError.innerHTML = "<p>Letters, spaces, hyphens (-), and apostrophes (') only.</p>";
        isValid = false;
    }
    
    if (!usernameRegex.test(username)) {
        usernameError.innerHTML = "<p>3-20 chars: Letters, numbers, periods (.), hyphens (-), and underscores (_) only.</p>";
        isValid = false;
    }

    if (!emailRegex.test(email)) {
        emailError.innerHTML = "<p>Enter a valid email address.</p>";
        isValid = false;
    }

    if (!passwordRegex.test(password)) {
        passwordError.innerHTML = "<p>Min. 8 chars: 1 uppercase, 1 lowercase, 1 digit, 1 special character.</p>";
        isValid = false;
    }

    if (!isValid) {
        console.log("Conditions not met. Failed to register.");
        return; // Stop execution if any validation fails
    } else {
        console.log("Successfully registered!");
    }
}
