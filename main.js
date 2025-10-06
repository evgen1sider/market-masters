/* global Utils */
document.addEventListener('DOMContentLoaded', () => {
  let currentLanguage = localStorage.getItem('language') || 'en';

  const languageToggle = document.getElementById('language-toggle');
  if (languageToggle) {
    languageToggle.addEventListener('click', () => {
      currentLanguage = currentLanguage === 'en' ? 'ua' : 'en';
      localStorage.setItem('language', currentLanguage);
      updateLanguage(currentLanguage);
      document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'uk';
      languageToggle.textContent = currentLanguage.toUpperCase();
    });
  }

  function updateLanguage(language) {
    document.querySelectorAll('[data-lang-en]').forEach(element => {
      const attr = `data-lang-${language}`;
      if (element.hasAttribute(attr)) {
        element.textContent = element.getAttribute(attr);
      }
    });
    loadContent(language);
  }

  function loadContent(language) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    const page = Utils.getPageName(window.location.pathname);
    const url = Utils.buildContentUrl(page, language, window.location.pathname);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
        return res.text();
      })
      .then(html => { contentDiv.innerHTML = html; })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        contentDiv.innerHTML = '<p class="error">Content failed to load.</p>';
      });
  }

  // Initial load
  updateLanguage(currentLanguage);

  // Registration form logic (safe guards)
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const usernameInput = document.getElementById('username');
      const username = usernameInput ? usernameInput.value : '';
      if (username) {
        localStorage.setItem('username', username);
        // try to navigate relative to current page
        window.location.href = 'user.html';
      }
    });
  }

  // Display username if logged in
  const username = localStorage.getItem('username');
  if (username) {
    const userLinks = document.querySelectorAll('.user-controls a');
    userLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.includes('user.html')) {
        link.textContent = username;
      }
    });
  }

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('nav.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('nav--open');
    });
  }
});
