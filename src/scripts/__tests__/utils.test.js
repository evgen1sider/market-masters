const Utils = require('../utils');

describe('Utils.getPageName', () => {
  test('returns index for empty or root paths', () => {
    expect(Utils.getPageName('')).toBe('index');
    expect(Utils.getPageName('/')).toBe('index');
  });

  test('parses simple file names', () => {
    expect(Utils.getPageName('/index.html')).toBe('index');
    expect(Utils.getPageName('/about.html')).toBe('about');
  });

  test('parses nested paths', () => {
    expect(Utils.getPageName('/src/pages/register.html')).toBe('register');
    expect(Utils.getPageName('/src/pages/games.html')).toBe('games');
  });
});

describe('Utils.buildContentUrl', () => {
  test('builds relative content url from pages folder', () => {
    const url = Utils.buildContentUrl('register', 'en', '/src/pages/register.html');
    expect(url).toBe('../../src/contents/register-content-en.html');
  });

  test('builds content url from root', () => {
    const url = Utils.buildContentUrl('index', 'ua', '/index.html');
    expect(url).toBe('src/contents/index-content-ua.html');
  });
});
