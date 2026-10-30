/**
 * AapkaResult.in - Official Interactive Scripts
 * Provides Instant Search, Category Filtering, Mobile Nav, and Form Handling
 */

// Mobile Navigation Drawer Toggle & Controller
function toggleMobileNav() {
  const navLinks = document.getElementById("navLinks");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  let backdrop = document.querySelector(".nav-backdrop");

  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.addEventListener("click", closeMobileNav);
    document.body.appendChild(backdrop);
  }

  if (navLinks) {
    const isOpening = !navLinks.classList.contains("show-mobile");
    if (isOpening) {
      navLinks.classList.add("show-mobile");
      if (menuBtn) {
        menuBtn.classList.add("active");
        menuBtn.setAttribute("aria-expanded", "true");
      }
      backdrop.classList.add("show");
      document.body.classList.add("nav-drawer-open");
    } else {
      closeMobileNav();
    }
  }
}

function closeMobileNav() {
  const navLinks = document.getElementById("navLinks");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const backdrop = document.querySelector(".nav-backdrop");

  if (navLinks) navLinks.classList.remove("show-mobile");
  if (menuBtn) {
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
  }
  if (backdrop) backdrop.classList.remove("show");
  document.body.classList.remove("nav-drawer-open");
}

// Mobile Dropdown Click Handler (Open on Click, Hide on Next Click)
function toggleDropdown(e) {
  if (e) {
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
  }
  const el = (e && (e.currentTarget || e.target)) ? (e.currentTarget || e.target) : null;
  const dropdown = el ? el.closest(".dropdown") : document.querySelector(".dropdown");
  if (dropdown) {
    const isOpen = dropdown.classList.toggle("open-mobile");
    const btn = dropdown.querySelector(".nav-dropdown-btn, button, a");
    if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
}

// Close mobile navigation drawer or dropdown on click outside
document.addEventListener("click", function(event) {
  const nav = document.querySelector(".site-nav");
  const toggleBtn = document.querySelector(".mobile-toggle");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.getElementById("navLinks");
  
  if (navLinks && navLinks.classList.contains("show-mobile")) {
    const clickedInsideToggle = (toggleBtn && toggleBtn.contains(event.target)) || (mobileMenuBtn && mobileMenuBtn.contains(event.target));
    const clickedInsideNav = nav && nav.contains(event.target);
    if (!clickedInsideNav && !clickedInsideToggle) {
      closeMobileNav();
    }
  }

  // Also close dropdown if tapped outside
  if (!event.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown.open-mobile").forEach(function(d) {
      d.classList.remove("open-mobile");
      const btn = d.querySelector(".nav-dropdown-btn, button, a");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }
});

// Close drawer on Escape key press
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeMobileNav();
  }
});

// Auto-bind toggleDropdown to any dropdown triggers that do not have inline onclick
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".dropdown > a, .dropdown > button").forEach(function(btn) {
    if (!btn.getAttribute("onclick")) {
      btn.addEventListener("click", toggleDropdown);
    }
  });
});

// Instant Live Real-time Search
function liveSearch(searchTerm) {
  const query = (searchTerm || "").toLowerCase().trim();
  const searchableElements = document.querySelectorAll(
    ".portal-box ul li, .trend-card, .styled-table tbody tr, .guide-card, .news-simple-card, .related-news-card"
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

// Mobile Portal Box Switcher (Instant Tab View on Mobile)
function switchPortalTab(target, buttonElement) {
  const btns = document.querySelectorAll(".portal-tab-btn");
  btns.forEach(btn => btn.classList.remove("active"));
  if (buttonElement) {
    buttonElement.classList.add("active");
  }

  const boxes = document.querySelectorAll(".portal-box");
  boxes.forEach(box => {
    if (target === "all") {
      box.style.display = "";
    } else {
      if (box.dataset.tab === target || box.id === "box-" + target) {
        box.style.display = "";
      } else {
        box.style.display = "none";
      }
    }
  });

  const tabsBar = document.getElementById("portalTabsBar");
  if (tabsBar && window.innerWidth <= 768) {
    const yOffset = -70;
    const y = tabsBar.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

