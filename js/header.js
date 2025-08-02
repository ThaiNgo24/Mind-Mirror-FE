// Header scroll effect
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Session filtering
const filterBtns = document.querySelectorAll(".filter-btn");
const sessionCards = document.querySelectorAll(".session-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    // Filter sessions
    sessionCards.forEach((card) => {
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Create particles for hero section
function createParticles() {
  const particleCount = 30;
  const heroSection = document.querySelector(".hero");

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random size between 5px and 15px
    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Random animation
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

    heroSection.appendChild(particle);
  }
}

// Initialize particles when page loads
window.addEventListener("load", createParticles);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Auth functionality
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const mobileLoginBtn = document.getElementById("mobileLoginBtn");
const mobileSignupBtn = document.getElementById("mobileSignupBtn");
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const closeLogin = document.getElementById("closeLogin");
const closeSignup = document.getElementById("closeSignup");
const showSignupFromLogin = document.getElementById("showSignupFromLogin");
const showLoginFromSignup = document.getElementById("showLoginFromSignup");
const authButtons = document.getElementById("authButtons");
const mobileAuthButtons = document.getElementById("mobileAuthButtons");
const userProfile = document.getElementById("userProfile");
const userAvatar = document.getElementById("userAvatar");
const logoutBtn = document.getElementById("logoutBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const googleLogin = document.getElementById("googleLogin");
const facebookLogin = document.getElementById("facebookLogin");
const googleSignup = document.getElementById("googleSignup");
const facebookSignup = document.getElementById("facebookSignup");

// Open login modal
function openLoginModal() {
  loginModal.classList.add("active");
  document.body.style.overflow = "hidden";
  // Close mobile menu if open
  nav.classList.remove("active");
  mobileMenuOverlay.classList.remove("active");
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
}

// Open signup modal
function openSignupModal() {
  signupModal.classList.add("active");
  document.body.style.overflow = "hidden";
  // Close mobile menu if open
  nav.classList.remove("active");
  mobileMenuOverlay.classList.remove("active");
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
}

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openLoginModal();
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openSignupModal();
});

mobileLoginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openLoginModal();
});

mobileSignupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openSignupModal();
});

// Close modals
closeLogin.addEventListener("click", () => {
  loginModal.classList.remove("active");
  document.body.style.overflow = "";
});

closeSignup.addEventListener("click", () => {
  signupModal.classList.remove("active");
  document.body.style.overflow = "";
});

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove("active");
    document.body.style.overflow = "";
  }
  if (e.target === signupModal) {
    signupModal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Switch between login and signup
showSignupFromLogin.addEventListener("click", (e) => {
  e.preventDefault();
  loginModal.classList.remove("active");
  signupModal.classList.add("active");
});

showLoginFromSignup.addEventListener("click", (e) => {
  e.preventDefault();
  signupModal.classList.remove("active");
  loginModal.classList.add("active");
});

// Login form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  if (email && password) {
    // In a real app, you would validate and send to server
    loginUser(email);
    loginModal.classList.remove("active");
    document.body.style.overflow = "";
  } else {
    alert("Please enter both email and password");
  }
});

// Signup form submission
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById(
    "signupConfirmPassword"
  ).value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  // In a real app, you would send to server
  loginUser(email, name);
  signupModal.classList.remove("active");
  document.body.style.overflow = "";
});

// Login user function
function loginUser(email, name = null) {
  // Hide auth buttons
  authButtons.style.display = "none";
  mobileAuthButtons.style.display = "none";

  // Show user profile
  userProfile.style.display = "block";

  // Set user avatar with first letter of name or email
  const displayName = name || email;
  userAvatar.textContent = displayName.charAt(0).toUpperCase();

  // Store login state in localStorage
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", email);
  if (name) {
    localStorage.setItem("userName", name);
  }

  alert(`Welcome ${name || email}! You are now logged in.`);
}

// Logout function
logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Clear login state
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");

  // Show auth buttons
  authButtons.style.display = "flex";
  mobileAuthButtons.style.display = "flex";

  // Hide user profile
  userProfile.style.display = "none";

  // Close dropdown if open
  userProfile.classList.remove("active");
});

// Toggle user dropdown
userProfile.addEventListener("click", () => {
  userProfile.classList.toggle("active");
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!userProfile.contains(e.target)) {
    userProfile.classList.remove("active");
  }
});

// Check login state when page loads
function checkLoginState() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");

  if (isLoggedIn === "true" && userEmail) {
    authButtons.style.display = "none";
    mobileAuthButtons.style.display = "none";
    userProfile.style.display = "block";
    userAvatar.textContent = (userName || userEmail).charAt(0).toUpperCase();
  }
}

// Google login/signup
function handleGoogleAuth() {
  // In a real app, you would implement Google OAuth
  alert("In a real implementation, this would connect to Google OAuth");
  // For demo purposes, we'll simulate login
  loginUser("googleuser@example.com", "Google User");
}

// Facebook login/signup
function handleFacebookAuth() {
  // In a real app, you would implement Facebook OAuth
  alert("In a real implementation, this would connect to Facebook OAuth");
  // For demo purposes, we'll simulate login
  loginUser("facebookuser@example.com", "Facebook User");
}

// Add event listeners for social buttons
googleLogin.addEventListener("click", handleGoogleAuth);
facebookLogin.addEventListener("click", handleFacebookAuth);
googleSignup.addEventListener("click", handleGoogleAuth);
facebookSignup.addEventListener("click", handleFacebookAuth);

// Check login state on page load
window.addEventListener("load", checkLoginState);
