/**
 * AapkaResult.in - Legacy Compatibility Script
 * Maintained for backward compatibility with cached client requests.
 * Core interactive features are now served via script.js.
 */
(function() {
  // Graceful fallback for legacy toggleMenu if called
  if (typeof window.toggleMenu !== 'function') {
    window.toggleMenu = function() {
      if (typeof window.toggleMobileNav === 'function') {
        window.toggleMobileNav();
      } else {
        const nav = document.getElementById('navLinks') || document.getElementById('navMenu');
        if (nav) nav.classList.toggle('show-mobile');
      }
    };
  }
})();
