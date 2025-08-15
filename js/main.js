// Mobile Menu Elements
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const nav = document.getElementById("nav");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

// Header scroll effect
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);
});

// Mobile menu toggle
mobileMenuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
  mobileMenuOverlay.classList.toggle("active");
  document.body.style.overflow = nav.classList.contains("active")
    ? "hidden"
    : "";
  mobileMenuBtn.innerHTML = nav.classList.contains("active")
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking overlay or links
mobileMenuOverlay.addEventListener("click", closeMobileMenu);
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

function closeMobileMenu() {
  nav.classList.remove("active");
  mobileMenuOverlay.classList.remove("active");
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  document.body.style.overflow = "";
}

// Create particles for hero section
function createParticles() {
  const heroSection = document.querySelector(".hero");
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.cssText = `
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 20 + 10}s ease-in-out ${
      Math.random() * 5
    }s infinite;
    `;
    heroSection.appendChild(particle);
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Auth elements
const authElements = {
  loginBtn: document.getElementById("loginBtn"),
  signupBtn: document.getElementById("signupBtn"),
  mobileLoginBtn: document.getElementById("mobileLoginBtn"),
  mobileSignupBtn: document.getElementById("mobileSignupBtn"),
  loginModal: document.getElementById("loginModal"),
  signupModal: document.getElementById("signupModal"),
  closeLogin: document.getElementById("closeLogin"),
  closeSignup: document.getElementById("closeSignup"),
  showSignupFromLogin: document.getElementById("showSignupFromLogin"),
  showLoginFromSignup: document.getElementById("showLoginFromSignup"),
  authButtons: document.getElementById("authButtons"),
  mobileAuthButtons: document.getElementById("mobileAuthButtons"),
  userProfile: document.getElementById("userProfile"),
  userAvatar: document.getElementById("userAvatar"),
  logoutBtn: document.getElementById("logoutBtn"),
  loginForm: document.getElementById("loginForm"),
  signupForm: document.getElementById("signupForm"),
};

// Auth modal functions
function openModal(modal) {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  closeMobileMenu();
}

function closeModal(modal) {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Modal event listeners
authElements.loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(authElements.loginModal);
});

authElements.signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(authElements.signupModal);
});

authElements.mobileLoginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(authElements.loginModal);
});

authElements.mobileSignupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(authElements.signupModal);
});

authElements.closeLogin.addEventListener("click", () =>
  closeModal(authElements.loginModal)
);
authElements.closeSignup.addEventListener("click", () =>
  closeModal(authElements.signupModal)
);

// Switch between auth modals
authElements.showSignupFromLogin.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal(authElements.loginModal);
  openModal(authElements.signupModal);
});

authElements.showLoginFromSignup.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal(authElements.signupModal);
  openModal(authElements.loginModal);
});

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === authElements.loginModal) closeModal(authElements.loginModal);
  if (e.target === authElements.signupModal)
    closeModal(authElements.signupModal);
});

// Auth form submissions
authElements.loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (email && password) {
    try {
      await loginUser(email, password);
      closeModal(authElements.loginModal);
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  } else {
    alert("Please enter both email and password");
  }
});

authElements.signupForm.addEventListener("submit", async (e) => {
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

  try {
    await registerUser(name, email, password);
    closeModal(authElements.signupModal);
  } catch (error) {
    console.error("Registration error:", error);
    alert(error.message);
  }
});

// Auth functions
async function loginUser(email, password) {
  try {
    const response = await fetch("https://mind-mirror-be.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    updateUIAfterLogin(data.user);

    if (data.reload) {
      window.location.reload();
    }

    return data.user;
  } catch (error) {
    throw error;
  }
}

async function registerUser(name, email, password) {
  try {
    const response = await fetch("https://mind-mirror-be.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Registration failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    updateUIAfterLogin(data.user);

    if (data.reload) {
      window.location.reload();
    }

    return data.user;
  } catch (error) {
    throw error;
  }
}

// Cập nhật hàm logoutUser
function logoutUser() {
  fetch("https://mind-mirror-be.onrender.com/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Xóa dữ liệu local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      updateUIAfterLogout();

      // Tự động reload trang sau khi đăng xuất thành công
      if (data.success) {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("Logout error:", error);
      // Vẫn xóa dữ liệu và reload nếu có lỗi
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      updateUIAfterLogout();
      window.location.reload();
    });
}

// UI update functions
function updateUIAfterLogin(user) {
  authElements.authButtons.style.display = "none";
  authElements.mobileAuthButtons.style.display = "none";
  authElements.userProfile.style.display = "block";
  authElements.userAvatar.textContent = user.name.charAt(0).toUpperCase();
}

function updateUIAfterLogout() {
  authElements.authButtons.style.display = "flex";
  authElements.mobileAuthButtons.style.display = "flex";
  authElements.userProfile.style.display = "none";
  authElements.userProfile.classList.remove("active");
}

// User profile dropdown
authElements.userProfile.addEventListener("click", () => {
  authElements.userProfile.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!authElements.userProfile.contains(e.target)) {
    authElements.userProfile.classList.remove("active");
  }
});

// Check auth status on page load
async function checkAuthStatus() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch("https://mind-mirror-be.onrender.com/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        updateUIAfterLogin(data.user);
      } else {
        clearAuthData();
      }
    } else {
      clearAuthData();
    }
  } catch (error) {
    console.error("Auth check error:", error);
    clearAuthData();
  }
}

function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  updateUIAfterLogout();
}

// Social login handlers (placeholder)
function handleSocialAuth(provider) {
  alert(`In a real implementation, this would connect to ${provider} OAuth`);
  const demoUser = {
    name: `${provider} User`,
    email: `${provider.toLowerCase()}user@example.com`,
  };
  localStorage.setItem("user", JSON.stringify(demoUser));
  updateUIAfterLogin(demoUser);
}

// Initialize
window.addEventListener("load", () => {
  createParticles();
  checkAuthStatus();
});

// Logout button
authElements.logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  logoutUser();
});

async function login(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  try {
    const response = await fetch("https://mind-mirror-be.onrender.com/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      if (data.reload) {
        window.location.reload();
      }
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
}
