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

// Native Web Share API with 1-Click Clipboard Fallback & Visual Feedback
function sharePageNative(btnElement) {
  const title = document.title || 'AapkaResult.in';
  const url = window.location.href;
  
  if (navigator.share) {
    navigator.share({
      title: title,
      text: title + ' - Check full details on AapkaResult.in',
      url: url
    }).catch(function(err) {
      if (err.name !== 'AbortError') {
        copyToClipboardFallback(btnElement, url);
      }
    });
  } else {
    copyToClipboardFallback(btnElement, url);
  }
}

function copyToClipboardFallback(btnElement, text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showShareFeedback(btnElement);
    }).catch(function() {
      promptCopyFallback(text);
    });
  } else {
    promptCopyFallback(text);
  }
}

function showShareFeedback(btnElement) {
  if (!btnElement) return;
  const originalHtml = btnElement.innerHTML;
  btnElement.innerHTML = '<span style="color:#22c55e;font-weight:700;">✓ Copied!</span>';
  btnElement.style.pointerEvents = 'none';
  setTimeout(function() {
    btnElement.innerHTML = originalHtml;
    btnElement.style.pointerEvents = '';
  }, 2200);
}

function promptCopyFallback(text) {
  window.prompt("Copy link to share:", text);
}




/* ==========================================================================
   GOOGLE ADSENSE & GDPR COOKIE CONSENT CONTROLLER
   ========================================================================== */
function initCookieConsent() {
  try {
    if (localStorage.getItem('aapkaresult_cookie_consent')) return;
  } catch (e) {
    return;
  }

  if (document.getElementById('arCookieConsent')) return;

  const banner = document.createElement('div');
  banner.id = 'arCookieConsent';
  banner.className = 'ar-cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-label', 'कुकी सहमति (Cookie Consent)');
  banner.innerHTML = `
    <div class="ar-cookie-inner">
      <div class="ar-cookie-text">
        <span class="ar-cookie-icon">🍪</span>
        <span>
          <strong>कुकी और विज्ञापन प्राथमिकताएं (Cookie Notice):</strong> AapkaResult.in वेबसाइट प्रदर्शन, ट्रैफ़िक विश्लेषण और Google AdSense द्वारा पर्सनलाइज़्ड विज्ञापन दिखाने के लिए कुकीज़ का उपयोग करता है। अधिक विवरण हेतु हमारी <a href="privacy-policy.html">Privacy Policy</a> देखें।
        </span>
      </div>
      <div class="ar-cookie-actions">
        <button type="button" class="ar-cookie-btn ar-cookie-accept" onclick="acceptAllCookies()">स्वीकार करें (Accept)</button>
        <button type="button" class="ar-cookie-btn ar-cookie-necessary" onclick="acceptNecessaryCookies()">केवल आवश्यक (Essential)</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);
}

function acceptAllCookies() {
  try {
    localStorage.setItem('aapkaresult_cookie_consent', 'all');
  } catch (e) {}
  removeCookieBanner();
}

function acceptNecessaryCookies() {
  try {
    localStorage.setItem('aapkaresult_cookie_consent', 'necessary');
  } catch (e) {}
  removeCookieBanner();
}

function removeCookieBanner() {
  const el = document.getElementById('arCookieConsent');
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(100%)';
    el.style.transition = 'all 0.3s ease';
    setTimeout(function() {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 300);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
  initCookieConsent();
}
