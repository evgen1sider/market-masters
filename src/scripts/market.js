document.addEventListener('DOMContentLoaded', () => {
  const balanceElement = document.getElementById('balance');
  const productsElement = document.getElementById('products');
  const inventoryElement = document.getElementById('inventory');

  let balance = 5000;
  const products = [
    { name: 'Grain', price: 10, quantity: 1000 },
    { name: 'Cloth', price: 10, quantity: 1000 },
    { name: 'Clothes', price: 20, quantity: 1000 },
    { name: 'Wood', price: 10, quantity: 1000 },
    { name: 'Meat', price: 20, quantity: 1000 },
    { name: 'Fruits', price: 10, quantity: 1000 },
    { name: 'Instruments', price: 30, quantity: 1000 }
  ];
  const inventory = {};

  function updateBalance() {
    balanceElement.textContent = `Balance: £${balance}`;
  }

  function updateMarket() {
    productsElement.innerHTML = '';
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      const productInfo = document.createElement('span');
      productInfo.textContent = `${product.name}: £${product.price} (Available: ${product.quantity})`;
      const buyButton = document.createElement('button');
      buyButton.textContent = 'Buy';
      buyButton.setAttribute('data-product', product.name);
      buyButton.setAttribute('data-action', 'buy');
      productElement.appendChild(productInfo);
      productElement.appendChild(buyButton);
      productsElement.appendChild(productElement);
    });
  }

  function updateInventory() {
    inventoryElement.innerHTML = '';
    for (const [name, quantity] of Object.entries(inventory)) {
      const inventoryItem = document.createElement('div');
      inventoryItem.className = 'inventory-item';
      const itemName = document.createElement('span');
      itemName.textContent = `${name}: ${quantity}`;
      const sellButton = document.createElement('button');
      sellButton.setAttribute('data-product', name);
      sellButton.setAttribute('data-action', 'sell');
      sellButton.textContent = 'Sell';
      inventoryItem.appendChild(itemName);
      inventoryItem.appendChild(sellButton);
      sellButton.setAttribute('data-action', 'sell');
      sellButton.textContent = 'Sell';
      inventoryItem.appendChild(itemName);
      inventoryItem.appendChild(sellButton);
      inventoryElement.appendChild(inventoryItem);
    }
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

