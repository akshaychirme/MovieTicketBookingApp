// Check if user is an admin when loading the page (For Admin Dashboard)
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    if (user.role === "admin") {
      window.location.href = "/adminDashboard.html"; // Redirect to the admin dashboard if role is admin
    } else {
      window.location.href = "/userHome.html"; // Redirect to the home page if role is user
    }
  }
});

// Your modal and login/register handling logic

// modal--------------------------------------------------
// Get modals and buttons
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const openLoginModal = document.getElementById("openLoginModal");
const closeLoginModal = document.getElementById("closeLoginModal");
const closeRegisterModal = document.getElementById("closeRegisterModal");
const showRegisterForm = document.getElementById("showRegisterForm");
const showLoginForm = document.getElementById("showLoginForm");

// Open Login Modal
openLoginModal.onclick = function () {
  loginModal.style.display = "block";
};

// Close Login Modal
closeLoginModal.onclick = function () {
  loginModal.style.display = "none";
};

// Open Register Modal
showRegisterForm.onclick = function () {
  loginModal.style.display = "none";
  registerModal.style.display = "block";
};

// Close Register Modal
closeRegisterModal.onclick = function () {
  registerModal.style.display = "none";
};

// Open Login from Register Modal
showLoginForm.onclick = function () {
  registerModal.style.display = "none";
  loginModal.style.display = "block";
};

// Close Modal if user clicks outside
window.onclick = function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
  if (event.target == registerModal) {
    registerModal.style.display = "none";
  }
};

// Handle both registration and login inside one DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // Handle registration form submission
  registerForm.addEventListener("submit", handleRegister);

  async function handleRegister(event) {
    event.preventDefault();

    // Get values from the form
    const username = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const role = "user"; // Set a default role here
    const user = { username, email, password, role };

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert("You have Registered successfully!");
        registerModal.style.display = "none";
        loginModal.style.display = "block";
      } else {
        const result = await response.json();
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("An error occurred. Please try again.");
    }
  }

  // Handle login form submission
  loginForm.addEventListener("submit", handleLogin);

  async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const credentials = { email, password };

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token and role in localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ email, role: result.role })
        );

        // Redirect user based on role
        if (result.role === "admin") {
          window.location.href = "/adminDashboard.html"; // Redirect to admin dashboard
        } else {
          window.location.href = "/userHome.html"; // Redirect to home page for regular users
        }
      } else {
        alert(result.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  }
});
