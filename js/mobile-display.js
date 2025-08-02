// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const nav = document.getElementById("nav");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

mobileMenuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
  mobileMenuOverlay.classList.toggle("active");
  mobileMenuBtn.innerHTML = nav.classList.contains("active")
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';

  document.body.style.overflow = nav.classList.contains("active")
    ? "hidden"
    : "";
});

mobileMenuOverlay.addEventListener("click", () => {
  nav.classList.remove("active");
  mobileMenuOverlay.classList.remove("active");
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  document.body.style.overflow = "";
});

// Close mobile menu when clicking a link
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    mobileMenuOverlay.classList.remove("active");
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = "";
  });
});
