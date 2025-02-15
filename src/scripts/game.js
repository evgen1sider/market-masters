document.addEventListener('DOMContentLoaded', () => {
  const startMarketGameButton = document.getElementById('start-market-game');
  if (startMarketGameButton) {
    startMarketGameButton.addEventListener('click', () => {
      window.location.href = '../pages/games/market.html';
    });
  }
});