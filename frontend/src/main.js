import { fetchProducts } from './api.js';
import {
  loginUser, registerUser, logoutUser, getCurrentUser
} from './auth.js';
import {
  renderProducts, setupAuthUI, showAdminPanel, renderCart, renderOrders
} from './ui.js';
import { setupPagination } from './counter.js';
import { trackEvent } from './analytics.js';
import {
  placeOrder, getCart, addProduct
} from './api.js';

const logoutBtn = document.getElementById('logoutBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const authFormContainer = document.getElementById('authFormContainer');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const authMessage = document.getElementById('authMessage');
const cartIcon = document.getElementById('cartIcon');
const orderIcon = document.getElementById('orderIcon');
const productsTab = document.getElementById('productsTab');

const productSection = document.getElementById('productSection');
const cartSection = document.getElementById('cartSection');
const orderSection = document.getElementById('orderSection');

let isLoginMode = true;

// ========== Section Switching ==========
productsTab.addEventListener('click', () => showOnly('products'));
cartIcon.addEventListener('click', () => showOnly('cart'));
orderIcon.addEventListener('click', () => showOnly('orders'));

function showOnly(section) {
  productSection.classList.add('hidden');
  cartSection.classList.add('hidden');
  orderSection.classList.add('hidden');

  if (section === 'products') productSection.classList.remove('hidden');
  else if (section === 'cart') cartSection.classList.remove('hidden');
  else if (section === 'orders') orderSection.classList.remove('hidden');
}

// ========== Auth Button Toggles ==========
showLoginBtn.addEventListener('click', () => {
  isLoginMode = true;
  formTitle.textContent = 'Login';
  submitBtn.textContent = 'Login';
  authMessage.textContent = '';
  authFormContainer.classList.remove('hidden');
});

showRegisterBtn.addEventListener('click', () => {
  isLoginMode = false;
  formTitle.textContent = 'Register';
  submitBtn.textContent = 'Register';
  authMessage.textContent = '';
  authFormContainer.classList.remove('hidden');
});

logoutBtn.addEventListener('click', () => {
  logoutUser();
  location.reload();
});

// ========== Auth Submit ==========
document.getElementById('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user_id = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  if (!user_id || !password) {
    authMessage.className = 'error-message';
    authMessage.textContent = 'Username and password are required.';
    return;
  }

  if (isLoginMode) {
    const success = await loginUser(user_id, password);
    if (success) {
      authMessage.className = 'success-message';
      authMessage.textContent = '✅ Login successful!';
      setTimeout(() => {
        authFormContainer.classList.add('hidden');
        setupAfterLogin();
        showOnly('products');
        trackEvent('login', { user_id });
      }, 1000);
    } else {
      authMessage.className = 'error-message';
      authMessage.textContent = '❌ Login failed. Try again.';
    }
  } else {
    const success = await registerUser(user_id, password, role);
    if (success) {
      authMessage.className = 'success-message';
      authMessage.textContent = '✅ Registered successfully! Please login.';
      setTimeout(() => {
        isLoginMode = true;
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        authMessage.textContent = '';
      }, 2000);
    } else {
      authMessage.className = 'error-message';
      authMessage.textContent = '❌ Registration failed. Try again.';
    }
  }
});

// ========== Admin Add Product ==========
document.getElementById('addProductForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('productName').value.trim();
  const price = +document.getElementById('productPrice').value;
  const image = document.getElementById('productImage').value.trim();

  try {
    if (!name || !price || !image) throw new Error('All fields required');
    await addProduct(name, price, image);
    document.getElementById('addProductMessage').textContent = '✅ Product added!';
    await loadProducts();
    trackEvent('product_add', { name, price });
  } catch (err) {
    document.getElementById('addProductMessage').textContent = '❌ ' + err.message;
  }
});

// ========== Pay Now ==========
document.getElementById('payNowBtn')?.addEventListener('click', async () => {
  try {
    const items = await getCart();
    if (!items || items.length === 0) {
      alert('🛒 Cart is empty!');
      return;
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const res = await placeOrder(items);

    if (res.success || res.message?.includes('Order placed')) {
      alert('✅ Payment Successful!');
      renderCart();
      renderOrders();
      showOnly('orders');
      trackEvent('payment_success', { total });
    } else {
      alert('❌ Failed to place order');
    }
  } catch (err) {
    alert('❌ Error placing order');
    console.error(err.message);
  }
});

// ========== Load Products ==========
async function loadProducts() {
  try {
    const products = await fetchProducts();
    renderProducts(products, loadProducts);
    setupPagination(products);
  } catch (err) {
    alert('❌ Failed to load products');
    console.error(err);
  }
}

// ========== Setup After Login ==========
function setupAfterLogin() {
  setupAuthUI();
  showAdminPanel();
  loadProducts();
  renderCart();
  renderOrders();
}

// ========== Secure Reload ==========
(function secureAccess() {
  const user = getCurrentUser();
  if (!user) {
    productSection.classList.add('hidden');
    cartSection.classList.add('hidden');
    orderSection.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    productsTab.classList.add('hidden');
    cartIcon.classList.add('hidden');
    orderIcon.classList.add('hidden');
    document.getElementById('adminPanel')?.classList.add('hidden');
    return;
  }

  setupAfterLogin();
  showOnly('products');
})();
