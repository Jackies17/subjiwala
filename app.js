const initialProducts = [
  { id: 1, name: 'Tomato', gujarati: 'ટામેટા', price: 25, mrp: 35, unit: 'kg', badge: 'Fresh', img: 'https://images.unsplash.com/photo-1482137526803-25edd694e5c5?w=600&h=400&fit=crop' },
  { id: 2, name: 'Spinach', gujarati: 'પાલક', price: 20, mrp: 28, unit: 'bunch', badge: 'Organic', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop' },
  { id: 3, name: 'Carrot', gujarati: 'ગાજર', price: 40, mrp: 55, unit: 'kg', badge: 'Best Seller', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=400&fit=crop' },
  { id: 4, name: 'Potato', gujarati: 'બટાટા', price: 30, mrp: 40, unit: 'kg', badge: 'Fresh', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=400&fit=crop' },
  { id: 5, name: 'Onion', gujarati: 'ડુંગળી', price: 35, mrp: 45, unit: 'kg', badge: 'Fresh', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=400&fit=crop' },
  { id: 6, name: 'Cauliflower', gujarati: 'ફૂલકોબી', price: 55, mrp: 75, unit: 'piece', badge: 'Seasonal', img: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&h=400&fit=crop' }
];

const state = {
  products: JSON.parse(localStorage.getItem('subji-products') || 'null') || initialProducts,
  cart: JSON.parse(localStorage.getItem('subji-cart') || 'null') || [],
  transactions: JSON.parse(localStorage.getItem('subji-transactions') || 'null') || [],
};

function saveState() {
  localStorage.setItem('subji-products', JSON.stringify(state.products));
  localStorage.setItem('subji-cart', JSON.stringify(state.cart));
  localStorage.setItem('subji-transactions', JSON.stringify(state.transactions));
}

function showLogin() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('customerView').classList.add('hidden');
  document.getElementById('adminView').classList.add('hidden');
}

function showCustomer() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('customerView').classList.remove('hidden');
  document.getElementById('adminView').classList.add('hidden');
}

function showAdmin() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('customerView').classList.add('hidden');
  document.getElementById('adminView').classList.remove('hidden');
  renderAdmin();
}

function handleLogin() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;

  if (username.toLowerCase() === 'nitin' && password === 'nitin@321') {
    showAdmin();
  } else {
    showCustomer();
  }
}

function formatAmount(value) {
  return Number(value).toFixed(2);
}

function getCartItemAmount(item) {
  const unit = item.unit || 'kg';
  if (unit === 'gm') return (item.price * item.qty) / 1000;
  return item.price * item.qty;
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = state.products.map(product => `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}" />
      <div class="badge">${product.badge}</div>
      <h3 style="margin:8px 0 2px;">${product.name}</h3>
      <div class="small">${product.gujarati}</div>
      <div class="meta">
        <div>
          <div class="price">₹${product.price}/${product.unit}</div>
          <div class="small">MRP ₹${product.mrp}</div>
        </div>
      </div>
      <div class="quantity-row">
        <input id="qty-${product.id}" class="quantity-input" type="number" min="1" step="0.5" value="1" />
        <select id="unit-${product.id}" class="unit-select">
          <option value="gm">gm</option>
          <option value="kg" selected>kg</option>
        </select>
        <button class="btn add-btn" onclick="addToCart(${product.id}, document.getElementById('qty-${product.id}').value, document.getElementById('unit-${product.id}').value)">Add</button>
      </div>
    </div>
  `).join('');
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  if (!state.cart.length) {
    cartItems.innerHTML = '<div class="small">Your cart is empty.</div>';
    document.getElementById('cartTotal').textContent = '0.00';
    document.getElementById('checkoutBtn').style.display = 'none';
    return;
  }

  cartItems.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div>
        <div style="font-weight:700;">${item.name}</div>
        <div class="small">Qty ${item.qty} ${item.unit || 'kg'}</div>
      </div>
      <div style="font-weight:700; color: var(--green);">₹${formatAmount(getCartItemAmount(item))}</div>
    </div>
  `).join('');

  const total = state.cart.reduce((sum, item) => sum + getCartItemAmount(item), 0);
  document.getElementById('cartTotal').textContent = formatAmount(total);
  document.getElementById('checkoutBtn').style.display = 'inline-block';
}

function addToCart(productId, quantity, unit) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const parsedQty = Number(quantity) || 1;
  const selectedUnit = unit === 'gm' ? 'gm' : 'kg';

  if (parsedQty <= 0) return;

  const existing = state.cart.find(item => item.id === productId && (item.unit || 'kg') === selectedUnit);
  if (existing) {
    existing.qty += parsedQty;
  } else {
    state.cart.push({ id: product.id, name: product.name, price: product.price, qty: parsedQty, unit: selectedUnit });
  }

  saveState();
  renderCart();
}

function renderTransactions() {
  const container = document.getElementById('transactionList');
  if (!state.transactions.length) {
    container.innerHTML = '<div class="small">No purchases yet.</div>';
    return;
  }
  container.innerHTML = state.transactions.map(tx => `
    <div class="transaction-item">
      <div>
        <div style="font-weight:700;">${tx.items}</div>
        <div class="small">${tx.date}</div>
      </div>
      <div style="font-weight:700; color: var(--green);">₹${tx.amount}</div>
    </div>
  `).join('');
}

function checkout() {
  if (!state.cart.length) return;
  const total = state.cart.reduce((sum, item) => sum + getCartItemAmount(item), 0);
  const items = state.cart.map(item => `${item.name} ${item.qty}${item.unit || 'kg'}`).join(', ');
  state.transactions.unshift({
    id: Date.now(),
    items,
    amount: Number(total.toFixed(2)),
    date: new Date().toLocaleString()
  });
  state.cart = [];
  saveState();
  renderCart();
  renderTransactions();
  alert(`Purchase complete! Paid ₹${formatAmount(total)}`);
}

function renderAdmin() {
  document.getElementById('rev1').textContent = '₹' + state.products.reduce((sum, p) => sum + p.price * 140, 0).toLocaleString();
  document.getElementById('rev2').textContent = '₹' + state.transactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString();
  document.getElementById('rev3').textContent = state.transactions.length;
  document.getElementById('rev4').textContent = '84';

  const container = document.getElementById('adminProducts');
  container.innerHTML = state.products.map(product => `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}" />
      <h3 style="margin:10px 0 4px;">${product.name}</h3>
      <div class="small">${product.gujarati}</div>
      <div class="admin-edit">
        <label>Price
          <input type="number" value="${product.price}" onchange="updateProduct(${product.id}, 'price', this.value)" />
        </label>
        <label>MRP
          <input type="number" value="${product.mrp}" onchange="updateProduct(${product.id}, 'mrp', this.value)" />
        </label>
        <label>Image URL
          <input value="${product.img}" onchange="updateProduct(${product.id}, 'img', this.value)" />
        </label>
        <label>Badge
          <input value="${product.badge}" onchange="updateProduct(${product.id}, 'badge', this.value)" />
        </label>
      </div>
      <button class="btn" onclick="saveProduct(${product.id})">Save</button>
    </div>
  `).join('');
}

function updateProduct(id, field, value) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;
  if (field === 'price' || field === 'mrp') product[field] = Number(value);
  else product[field] = value;
}

function saveProduct(id) {
  saveState();
  renderProducts();
  renderCart();
  renderAdmin();
  alert('Product updated successfully.');
}

function scrollToProducts() {
  document.getElementById('productGrid').scrollIntoView({ behavior: 'smooth' });
}

renderProducts();
renderCart();
showLogin();
