document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const captchaQuestion = document.getElementById("captchaQuestion");
  let correctAnswer;

  // Generate simple CAPTCHA question
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    correctAnswer = num1 + num2;
    captchaQuestion.textContent = `${num1} + ${num2}`;

    // Send the answer to the server using AJAX to store in session
    fetch("set_captcha.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `captcha=${correctAnswer}`,
    });
  };

  generateCaptcha();

  // Display validation error messages
  const showError = (input, message) => {
    const errorDisplay = input.nextElementSibling;
    errorDisplay.textContent = message;
    errorDisplay.style.display = "block";
  };

  const clearError = (input) => {
    const errorDisplay = input.nextElementSibling;
    errorDisplay.style.display = "none";
  };

  // Validation on form submit
  form.addEventListener("submit", (e) => {
    let isValid = true;

    // Full Name validation
    if (!form.fullName.value.trim()) {
      showError(form.fullName, "Full name is required");
      isValid = false;
    } else {
      clearError(form.fullName);
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailPattern.test(form.email.value.trim())) {
      showError(form.email, "Please enter a valid email");
      isValid = false;
    } else {
      clearError(form.email);
    }

    // Password validation
    if (form.password.value.length < 8) {
      showError(form.password, "Password must be at least 8 characters");
      isValid = false;
    } else {
      clearError(form.password);
    }

    // Confirm Password validation
    if (form.password.value !== form.confirmPassword.value) {
      showError(form.confirmPassword, "Passwords do not match");
      isValid = false;
    } else {
      clearError(form.confirmPassword);
    }

    // CAPTCHA validation
    if (parseInt(form.captcha.value) !== correctAnswer) {
      showError(form.captcha, "Incorrect answer for CAPTCHA");
      isValid = false;
    } else {
      clearError(form.captcha);
    }

    if (!isValid) {
      e.preventDefault();
    }
  });
});
