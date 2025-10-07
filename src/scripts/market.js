document.addEventListener('DOMContentLoaded', () => {
  const balanceElement = document.getElementById('balance');
  const productsElement = document.getElementById('products');
  const inventoryElement = document.getElementById('inventory');

  let balance = 5000;
  let products = [
    { name: 'Grain', price: 10, quantity: 1000, translations: { en: 'Grain', ua: 'Зерно' } },
    { name: 'Cloth', price: 10, quantity: 1000, translations: { en: 'Cloth', ua: 'Тканина' } },
    { name: 'Clothes', price: 20, quantity: 1000, translations: { en: 'Clothes', ua: 'Одяг' } },
    { name: 'Wood', price: 10, quantity: 1000, translations: { en: 'Wood', ua: 'Дерево' } },
    { name: 'Meat', price: 20, quantity: 1000, translations: { en: 'Meat', ua: 'М\'ясо' } },
    { name: 'Fruits', price: 10, quantity: 1000, translations: { en: 'Fruits', ua: 'Фрукти' } },
    { name: 'Instruments', price: 30, quantity: 1000, translations: { en: 'Instruments', ua: 'Інструменти' } }
  ];
  const inventory = {};

  // If a daily seed was provided (from Daily Challenge), initialize products deterministically
  const dailySeed = localStorage.getItem('mm_daily_seed');
  if (dailySeed && window.DailyChallenge && typeof window.DailyChallenge.generateMarket === 'function') {
    try {
      const seedNum = Number(dailySeed) || 0;
      const dailyProducts = window.DailyChallenge.generateMarket(seedNum);
      // Map dailyProducts to the format used in this script
      products = dailyProducts.map(p => ({
        name: p.name,
        price: Math.max(1, Math.round(p.price)),
        quantity: 1000,
        translations: { en: p.name, ua: p.name }
      }));
      // expose the seed so score submission can reference it
      window.__mm_daily_seed = seedNum;
    } catch (e) {
      // ignore and fall back to default products
      // eslint-disable-next-line no-console
      console.error('Failed to initialize daily market:', e);
    }
  }

  function updateBalance() {
    balanceElement.setAttribute('data-lang-en', `Balance: £${balance}`);
    balanceElement.setAttribute('data-lang-ua', `Баланс: £${balance}`);
    balanceElement.textContent = `Balance: £${balance}`;
  }

  // display seed label if present
  (function showSeedLabel() {
    const seed = window.__mm_daily_seed || localStorage.getItem('mm_daily_seed');
    if (!seed) return;
    const seedLabel = document.createElement('div');
    seedLabel.className = 'seed-label';
    seedLabel.textContent = `Seed: ${seed}`;
    if (balanceElement && balanceElement.parentNode) {
      balanceElement.parentNode.insertBefore(seedLabel, balanceElement.nextSibling);
    }
  }());

  function updateMarket() {
    productsElement.innerHTML = '';
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.setAttribute('data-product-name', product.name);
      const productInfo = document.createElement('span');
      productInfo.setAttribute('data-lang-en', `${product.translations.en}: £${product.price} (Available: ${product.quantity})`);
      productInfo.setAttribute('data-lang-ua', `${product.translations.ua}: £${product.price} (Доступно: ${product.quantity})`);
      productInfo.textContent = `${product.translations.en}: £${product.price} (Available: ${product.quantity})`;
      const buyButton = document.createElement('button');
      buyButton.setAttribute('data-lang-en', 'Buy');
      buyButton.setAttribute('data-lang-ua', 'Купити');
      buyButton.textContent = 'Buy';
      buyButton.setAttribute('data-product', product.name);
      buyButton.setAttribute('data-action', 'buy');
      productElement.appendChild(productInfo);
      productElement.appendChild(buyButton);
      // placeholder for price change badge
      const badge = document.createElement('span');
      badge.className = 'price-badge';
      productElement.appendChild(badge);
      productsElement.appendChild(productElement);
    });
    updateLanguage(localStorage.getItem('language') || 'en');
  }

  function flashPriceChange(productName, direction = 'up') {
    const el = productsElement.querySelector(`[data-product-name="${productName}"]`);
    if (!el) return;
    const badge = el.querySelector('.price-badge');
    if (!badge) return;
    badge.textContent = direction === 'up' ? '↑' : '↓';
    badge.classList.add(direction === 'up' ? 'price-up' : 'price-down');
    setTimeout(() => {
      badge.classList.remove('price-up', 'price-down');
      badge.textContent = '';
    }, 900);
  }

  function updateInventory() {
    inventoryElement.innerHTML = '';
    for (const [name, quantity] of Object.entries(inventory)) {
      const product = products.find(p => p.name === name);
      const inventoryItem = document.createElement('div');
      inventoryItem.className = 'inventory-item';
      const itemName = document.createElement('span');
      itemName.setAttribute('data-lang-en', `${product.translations.en}: ${quantity}`);
      itemName.setAttribute('data-lang-ua', `${product.translations.ua}: ${quantity}`);
      itemName.textContent = `${product.translations.en}: ${quantity}`;
      const sellButton = document.createElement('button');
      sellButton.setAttribute('data-lang-en', 'Sell');
      sellButton.setAttribute('data-lang-ua', 'Продати');
      sellButton.textContent = 'Sell';
      sellButton.setAttribute('data-product', name);
      sellButton.setAttribute('data-action', 'sell');
      inventoryItem.appendChild(itemName);
      inventoryItem.appendChild(sellButton);
      inventoryElement.appendChild(inventoryItem);
    }
    updateLanguage(localStorage.getItem('language') || 'en');
  }

  function updateLanguage(language) {
    document.querySelectorAll('[data-lang-en]').forEach(element => {
      element.textContent = element.getAttribute(`data-lang-${language}`);
    });
  }

  // Add a finish/submit button for Daily Challenge sessions
  (function addFinishButton() {
    const gameContainer = document.getElementById('game');
    if (!gameContainer) return;
    const finishRow = document.createElement('div');
    finishRow.className = 'cta-row';
    const finishBtn = document.createElement('button');
    finishBtn.className = 'btn secondary';
    finishBtn.id = 'finish-session';
    finishBtn.textContent = 'Finish & Submit Score';
    finishRow.appendChild(finishBtn);
    // insert after balance element
    const balanceCard = document.getElementById('balance');
    if (balanceCard && balanceCard.parentNode) {
      balanceCard.parentNode.insertBefore(finishRow, balanceCard.nextSibling);
    }

    finishBtn.addEventListener('click', () => {
      // compute simple score: balance + inventory value
      let inventoryValue = 0;
      for (const [name, qty] of Object.entries(inventory)) {
        const prod = products.find(p => p.name === name);
        if (prod) inventoryValue += prod.price * qty;
      }
      const score = balance + inventoryValue;
      // show modal summary for submit
      openSummaryModal({ score });
    });
  }());

  productsElement.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const productName = event.target.getAttribute('data-product');
      const product = products.find(p => p.name === productName);
      if (product && balance >= product.price && product.quantity > 0) {
        balance -= product.price;
        product.quantity -= 1;
        inventory[productName] = (inventory[productName] || 0) + 1;
        updateBalance();
        updateMarket();
        updateInventory();
        flashPriceChange(productName, 'up');
      }
    }
  });

  inventoryElement.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const productName = event.target.getAttribute('data-product');
      const product = products.find(p => p.name === productName);
      if (product && inventory[productName] > 0) {
        balance += product.price;
        product.quantity += 1;
        inventory[productName] -= 1;
        if (inventory[productName] === 0) {
          delete inventory[productName];
        }
        updateBalance();
        updateMarket();
        updateInventory();
        flashPriceChange(productName, 'down');
      }
    }
  });

  updateBalance();
  updateMarket();
  updateInventory();

  // Summary modal creation and helper
  function createSummaryModal() {
    const modal = document.createElement('div');
    modal.className = 'mm-modal';
    modal.innerHTML = `
      <div class="mm-modal-content">
        <h3>Session Summary</h3>
        <p id="mm-summary-score">Score: 0</p>
        <label>Enter name: <input id="mm-player-name" maxlength="12" value="Player"></label>
        <div class="cta-row">
          <button id="mm-submit-score" class="btn">Submit Score</button>
          <button id="mm-cancel" class="btn secondary">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    // wire buttons
    document.getElementById('mm-cancel').addEventListener('click', () => {
      modal.classList.remove('open');
    });
    document.getElementById('mm-submit-score').addEventListener('click', () => {
      const name = (document.getElementById('mm-player-name').value || 'Anon').slice(0, 12);
      const scoreText = document.getElementById('mm-summary-score').textContent || 'Score: 0';
      const score = Number(scoreText.replace(/[^0-9]/g, '')) || 0;
      if (window.DailyChallenge && typeof window.DailyChallenge.saveScore === 'function') {
        const seed = window.__mm_daily_seed || Number(localStorage.getItem('mm_daily_seed')) || 0;
        window.DailyChallenge.saveScore({ name, score, seed });
        alert('Score saved locally.');
        localStorage.removeItem('mm_daily_seed');
      } else {
        alert('Daily leaderboard unavailable.');
      }
      modal.classList.remove('open');
    });
    return modal;
  }

  const summaryModal = createSummaryModal();

  function openSummaryModal({ score = 0 } = {}) {
    document.getElementById('mm-summary-score').textContent = `Score: ${score}`;
    summaryModal.classList.add('open');
  }
});

