import { todaysSeed, generateMarket, saveScore, getLeaderboard } from './daily-challenge.js';

function openMarketWithSeed(seed) {
  // store seed so market page can read it (simple approach)
  localStorage.setItem('mm_daily_seed', String(seed));
  // navigate to market page
  const path = '/src/pages/games/market.html';
  window.location.href = window.location.origin + path;
}

document.addEventListener('click', (evt) => {
  const btn = evt.target.closest && evt.target.closest('#start-daily-challenge');
  if (btn) {
    const seed = todaysSeed(new Date());
    openMarketWithSeed(seed);
  }
  const lb = evt.target.closest && evt.target.closest('#view-daily-leaderboard');
  if (lb) {
    evt.preventDefault();
    const list = getLeaderboard();
    alert('Top scores (local):\n' + list.map((r, i) => `${i+1}. ${r.name} — ${r.score}`).join('\n'));
  }
});

// Expose for debugging
window.DailyChallenge = { todaysSeed, generateMarket, saveScore, getLeaderboard };
