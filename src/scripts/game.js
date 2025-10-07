document.addEventListener('click', (evt) => {
  const target = evt.target;
  if (!target) return;
  // if the click originates from the start button (or its child), handle it
  const startBtn = target.closest && target.closest('#start-market-game');
  if (startBtn) {
    evt.preventDefault();
    const targetPath = '/src/pages/games/market.html';
    window.location.href = window.location.origin + targetPath;
  }
});