document.addEventListener('DOMContentLoaded', (event) => {
  console.log('The page has fully loaded');

  const languageToggle = document.getElementById('language-toggle');
  let currentLanguage = localStorage.getItem('language') || 'en';

  languageToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'ua' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateLanguage(currentLanguage);
  });

  function updateLanguage(language) {
    document.querySelectorAll('[data-lang-en]').forEach(element => {
      element.textContent = element.getAttribute(`data-lang-${language}`);
    });
    loadContent(language);
  }

  function loadContent(language) {
    const contentDiv = document.getElementById('content');
    if (contentDiv) {
      const page = window.location.pathname.split('/').pop().split('.')[0];
      fetch(`/src/contents/${page}-content-${language}.html`)
        .then(response => response.text())
        .then(data => {
          contentDiv.innerHTML = data;
        });
    }
  }

  // Initial load
  updateLanguage(currentLanguage);

  // Registration form logic
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      localStorage.setItem('username', username);
      window.location.href = 'user.html';
    });
  }

  // Display username if logged in
  const username = localStorage.getItem('username');
  if (username) {
    const userLink = document.querySelector('.user-controls a[href="user.html"]');
    if (userLink) {
      userLink.textContent = username;
    }
  }
});
