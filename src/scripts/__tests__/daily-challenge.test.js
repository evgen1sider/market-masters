const { todaysSeed, generateMarket, saveScore, getLeaderboard } = require('../test-helpers/daily-challenge.cjs');

// Provide a simple localStorage mock when running under Node (no JSDOM)
function createLocalStorageMock() {
  let store = Object.create(null);
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = Object.create(null);
    }
  };
}

beforeEach(() => {
  if (typeof global.localStorage === 'undefined') {
    // attach a mock to the global scope used by tests
    global.localStorage = createLocalStorageMock();
  } else {
    global.localStorage.clear();
  }
});

describe('daily-challenge core', () => {
  test('todaysSeed produces a numeric seed for a given date', () => {
    const d = new Date('2025-10-07T12:00:00Z');
    const seed = todaysSeed(d);
    expect(typeof seed).toBe('number');
    expect(Number.isInteger(seed)).toBe(true);
  });

  test('generateMarket returns deterministic products for a seed', () => {
    const a = generateMarket(42);
    const b = generateMarket(42);
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
    expect(a[0]).toHaveProperty('name');
    expect(a[0]).toHaveProperty('price');
  });

  test('saveScore and getLeaderboard persist and return sorted list', () => {
    saveScore({ name: 'Alice', score: 120, seed: 1 });
    saveScore({ name: 'Bob', score: 200, seed: 1 });
    saveScore({ name: 'Carol', score: 150, seed: 2 });
    const lb = getLeaderboard();
    expect(lb.length).toBe(3);
    // highest score first
    expect(lb[0].name).toBe('Bob');
    expect(lb[1].name).toBe('Carol');
    expect(lb[2].name).toBe('Alice');
  });
});
