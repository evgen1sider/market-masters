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

    // show accessible loading indicator with localized text
    const loadingText = language === 'ua' ? 'Завантаження сторінки...' : 'Loading page...';
    contentDiv.classList.remove('content-loaded');
    contentDiv.innerHTML = `<div class="loading" role="status" aria-live="polite"><span class="spinner" aria-hidden="true"></span><span class="loading-text">${loadingText}</span></div>`;

    let page = Utils.getPageName(window.location.pathname);
    if (!page || typeof page !== 'string' || page.trim() === '') {
      page = 'index'; // fallback to default page name
    }
    const url = Utils.buildContentUrl(page, language, window.location.pathname);

    // helper: fetch with timeout using AbortController
    function fetchWithTimeout(u, timeout = 10000) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      return fetch(u, { signal: controller.signal }).finally(() => clearTimeout(id));
    }

    // helper: retry logic
    function fetchWithRetry(u, attempts = 3, timeout = 10000, delay = 600) {
      let attempt = 0;
      return new Promise((resolve, reject) => {
        const tryOnce = () => {
          attempt += 1;
          fetchWithTimeout(u, timeout)
            .then(res => {
              if (!res.ok) throw new Error(`Failed to load ${u}: ${res.status}`);
              return res.text();
            })
            .then(text => resolve(text))
            .catch(err => {
              if (attempt < attempts) {
                setTimeout(tryOnce, delay);
              } else {
                reject(err);
              }
            });
        };
        tryOnce();
      });
    }

    fetchWithRetry(url, 3, 10000, 700)
      .then(html => {
        contentDiv.innerHTML = html;
        // trigger fade-in
        window.requestAnimationFrame(() => {
          contentDiv.classList.add('content-loaded');
        });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        const errorText = language === 'ua' ? 'Не вдалося завантажити контент.' : 'Content failed to load.';
        const tryAgainText = language === 'ua' ? 'Спробувати ще' : 'Try again';
        contentDiv.innerHTML = `<div class="error"> <p>${errorText}</p> <button class="btn secondary" id="retry-load">${tryAgainText}</button> </div>`;
        const retryBtn = document.getElementById('retry-load');
        if (retryBtn) retryBtn.addEventListener('click', () => loadContent(language));
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
      nav.classList.toggle('nav-open');
    });
  }

  // Active link highlighting and auto-close behavior for mobile nav
  function highlightActiveLink() {
    const links = document.querySelectorAll('#nav-list a');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
      try {
        const href = (link.getAttribute('href') || '').split('/').pop();
        if (!href) return link.classList.remove('active');
        // consider index.html equivalence with empty path
        if (href === current || (href === 'index.html' && current === '')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      } catch (e) {
        // ignore malformed hrefs
        link.classList.remove('active');
      }
    });
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    if (nav.classList.contains('nav-open')) {
      nav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // Close mobile nav when a nav link is clicked (improves UX on small screens)
  const navLinks = document.querySelectorAll('#nav-list a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // highlight immediately for snappy feedback
      highlightActiveLink();
      // close the nav for mobile
      closeNav();
    });
  });

  // Close the nav when clicking outside of it
  document.addEventListener('click', (evt) => {
    if (!nav || !navToggle) return;
    if (!nav.classList.contains('nav-open')) return;
    const target = evt.target;
    if (nav.contains(target) || navToggle.contains(target)) return;
    closeNav();
  });

  // Close on Escape key
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closeNav();
    }
  });

  // Run once on load to mark active link
  highlightActiveLink();
});
