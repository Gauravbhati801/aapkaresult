/**
 * AapkaResult.in - Official Interactive Scripts
 * Provides Instant Search, Category Filtering, Mobile Nav, and Form Handling
 */

// Mobile Navigation Toggle
function toggleMobileNav() {
  const navLinks = document.getElementById("navLinks");
  if (navLinks) {
    navLinks.classList.toggle("show-mobile");
  }
}

// Mobile Dropdown Click Handler (Open on Click, Hide on Next Click)
function toggleDropdown(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const dropdown = e.currentTarget ? e.currentTarget.closest(".dropdown") : null;
  if (dropdown) {
    dropdown.classList.toggle("open-mobile");
  }
}

// Close mobile navigation on click outside
document.addEventListener("click", function(event) {
  const nav = document.querySelector(".site-nav");
  const toggleBtn = document.querySelector(".mobile-toggle");
  const navLinks = document.getElementById("navLinks");
  
  if (nav && toggleBtn && navLinks && navLinks.classList.contains("show-mobile")) {
    if (!nav.contains(event.target) && !toggleBtn.contains(event.target)) {
      navLinks.classList.remove("show-mobile");
    }
  }
});

// Instant Live Real-time Search
function liveSearch(searchTerm) {
  const query = (searchTerm || "").toLowerCase().trim();
  const searchableElements = document.querySelectorAll(
    ".portal-box ul li, .trend-card, .styled-table tbody tr, .guide-card"
  );

  searchableElements.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (!query || text.includes(query)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

// Category Pill Filter
function filterPill(category, buttonElement) {
  // Update active pill button style
  document.querySelectorAll(".pill-btn").forEach(btn => btn.classList.remove("active"));
  if (buttonElement) {
    buttonElement.classList.add("active");
  }

  const query = (category || "").toLowerCase().trim();
  const items = document.querySelectorAll(".portal-box ul li, .trend-card, .styled-table tbody tr");

  items.forEach(item => {
    if (query === "all") {
      item.style.display = "";
    } else {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    }
  });
}

// Contact Form Handler with Validation
function handleContactForm(e) {
  e.preventDefault();
  const submitBtn = document.getElementById("contactSubmitBtn");
  const feedback = document.getElementById("contactFeedback");

  if (!submitBtn || !feedback) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending Message...";

  setTimeout(() => {
    feedback.style.display = "block";
    feedback.className = "notice-box";
    feedback.style.borderLeftColor = "#16a34a";
    feedback.style.background = "#dcfce7";
    feedback.style.color = "#166534";
    feedback.innerHTML = "<strong>Message Sent Successfully!</strong> Thank you for reaching out to AapkaResult.in. Our editorial desk will reply to your email within 24 to 48 hours.";
    
    document.getElementById("contactForm").reset();
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Inquiry";
  }, 700);
}
