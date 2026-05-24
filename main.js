function toggleMenu() {
  const menu = document.getElementById("navMenu");
  // We will toggle a class to show/hide with CSS transitions
  menu.classList.toggle("open");
}

// Dropdown Toggle Logic
document.addEventListener('DOMContentLoaded', function() {
  const dropbtns = document.querySelectorAll('.dropbtn');
  
  dropbtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
          e.preventDefault(); // # लिंक को पेज के ऊपर जाने से रोकेगा
          const dropdownContent = this.nextElementSibling;
          dropdownContent.classList.toggle('show');
      });
  });

  // जब यूजर ड्रॉपडाउन के बाहर कहीं भी क्लिक करे, तो उसे बंद कर दें
	  window.addEventListener('click', function(e) {
      if (!e.target.matches('.dropbtn')) {
          const dropdowns = document.querySelectorAll('.dropdown-content');
          dropdowns.forEach(function(dropdown) {
              if (dropdown.classList.contains('show')) {
                  dropdown.classList.remove('show');
              }
          });
      }

      // मोबाइल मेनू (Side Menu) के बाहर क्लिक करने पर उसे बंद करने का कोड
      const navMenu = document.getElementById("navMenu");
      const menuBtn = document.querySelector(".menu");
      if (navMenu && navMenu.classList.contains('open')) {
          if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
              navMenu.classList.remove('open');
          }
      }
	  });

  // Homepage quick search
  const searchInput = document.getElementById('siteSearchInput');
  const searchResults = document.getElementById('siteSearchResults');
  const searchStatus = document.getElementById('siteSearchStatus');

  if (searchInput && searchResults && searchStatus) {
      const allLinks = Array.from(document.querySelectorAll('main a[href]'))
          .filter((link) => link.textContent && link.textContent.trim().length > 2)
          .map((link) => ({
              title: link.textContent.trim().replace(/\s+/g, ' '),
              href: link.getAttribute('href')
          }))
          .filter((item, index, arr) =>
              arr.findIndex((x) => x.title === item.title && x.href === item.href) === index
          );

      function renderSearchResults(query) {
          const q = query.trim().toLowerCase();
          searchResults.innerHTML = '';

          if (!q) {
              searchStatus.textContent = 'Popular: SSC GD, UP Police, Agniveer, DSSSB';
              return;
          }

          const filtered = allLinks.filter((item) => item.title.toLowerCase().includes(q)).slice(0, 8);

          if (filtered.length === 0) {
              searchStatus.textContent = `No results found for "${query}"`;
              return;
          }

          searchStatus.textContent = `${filtered.length} result(s) found`;

          filtered.forEach((item) => {
              const li = document.createElement('li');
              const a = document.createElement('a');
              a.href = item.href;
              a.textContent = item.title;
              li.appendChild(a);
              searchResults.appendChild(li);
          });
      }

      searchInput.addEventListener('input', function() {
          renderSearchResults(this.value);
      });
  }

  // Visitor counter (global page visits)
  const visitorCountEl = document.getElementById('visitorCount');
  if (visitorCountEl) {
      fetch('https://api.countapi.xyz/hit/aapkaresult.in/visits')
          .then((res) => res.json())
          .then((data) => {
              if (data && typeof data.value !== 'undefined') {
                  visitorCountEl.textContent = Number(data.value).toLocaleString('en-IN');
              } else {
                  visitorCountEl.textContent = 'N/A';
              }
          })
          .catch(() => {
              visitorCountEl.textContent = 'Unavailable';
          });
  }
});
