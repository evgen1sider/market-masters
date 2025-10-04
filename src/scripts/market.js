document.addEventListener('DOMContentLoaded', () => {
  const balanceElement = document.getElementById('balance');
  const productsElement = document.getElementById('products');
  const inventoryElement = document.getElementById('inventory');

  let balance = 5000;
  const products = [
    { name: 'Grain', price: 10, quantity: 1000, translations: { en: 'Grain', ua: 'Зерно' } },
    { name: 'Cloth', price: 10, quantity: 1000, translations: { en: 'Cloth', ua: 'Тканина' } },
    { name: 'Clothes', price: 20, quantity: 1000, translations: { en: 'Clothes', ua: 'Одяг' } },
    { name: 'Wood', price: 10, quantity: 1000, translations: { en: 'Wood', ua: 'Дерево' } },
    { name: 'Meat', price: 20, quantity: 1000, translations: { en: 'Meat', ua: 'М\'ясо' } },
    { name: 'Fruits', price: 10, quantity: 1000, translations: { en: 'Fruits', ua: 'Фрукти' } },
    { name: 'Instruments', price: 30, quantity: 1000, translations: { en: 'Instruments', ua: 'Інструменти' } }
  ];
  const inventory = {};

  function updateBalance() {
    balanceElement.setAttribute('data-lang-en', `Balance: £${balance}`);
    balanceElement.setAttribute('data-lang-ua', `Баланс: £${balance}`);
    balanceElement.textContent = `Balance: £${balance}`;
  }

  function updateMarket() {
    productsElement.innerHTML = '';
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
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
      productsElement.appendChild(productElement);
    });
    updateLanguage(localStorage.getItem('language') || 'en');
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
      }
    }
  });

  updateBalance();
  updateMarket();
  updateInventory();
});

