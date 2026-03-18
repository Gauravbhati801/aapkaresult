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
  });
});