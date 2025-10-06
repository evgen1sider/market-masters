/* Utility helpers for the app. Exported for testing. */
/* global window */
const Utils = {
  // Extract the page name from a pathname. Examples:
  // '/index.html' -> 'index', '/src/pages/register.html' -> 'register'
  getPageName(pathname) {
    if (!pathname) return 'index';
    const parts = pathname.split('/').filter(Boolean);
    const last = parts.pop() || '';
    const name = last.split('.').shift();
    return name || 'index';
  },

  // Build the content URL relative to where the page lives.
  buildContentUrl(page, language, pathname) {
    const isInPages = pathname && pathname.includes('/src/pages/');
    const base = isInPages ? '../../src/contents/' : 'src/contents/';
    return `${base}${page}-content-${language}.html`;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
} else if (typeof window !== 'undefined') {
  window.Utils = Utils;
}
