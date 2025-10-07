import { LCG, hashStringToSeed } from './seeded.js';

const STORAGE_KEY = 'mm_daily_leaderboard';

export function todaysSeed(date = new Date()) {
  const ymd = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`;
  return hashStringToSeed(ymd);
}

export function generateMarket(seed) {
  const rnd = LCG(seed);
  const products = [];
  const names = ['Apples', 'Bread', 'Coal', 'Steel', 'Silk', 'Spices'];
  for (let i = 0; i < names.length; i++) {
    const base = Math.floor(10 + rnd() * 90);
    const volatility = Math.round(rnd() * 20) - 10;
    products.push({
      id: `p${i}`,
      name: names[i],
      price: base,
      volatility,
    });
  }
  return products;
}

export function saveScore({ name = 'Anon', score = 0, seed = 0 }) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  all.push({ name, score, seed, ts: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getLeaderboard() {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  // sort desc and return top 10
  return all.sort((a, b) => b.score - a.score).slice(0, 10);
}
