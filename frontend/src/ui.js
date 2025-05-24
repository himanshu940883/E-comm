import { getCurrentUser } from './auth.js';
import {
  addToCart,
  getCart,
  getOrders,
  updateCartItem,
  deleteCartItem,
  updateProduct,
  deleteProduct
} from './api.js';
import { trackEvent } from './analytics.js';
import './ui.css';

const productList = document.getElementById('productList');
const adminPanel = document.getElementById('adminPanel');
const cartList = document.getElementById('cartList');
const orderList = document.getElementById('orderList');
const editFormContainer = document.getElementById('editProductFormContainer');

function showOnly(section) {
  document.getElementById('productSection')?.classList.add('hidden');
  document.getElementById('cartSection')?.classList.add('hidden');
  document.getElementById('orderSection')?.classList.add('hidden');
  if (section === 'products') document.getElementById('productSection')?.classList.remove('hidden');
  if (section === 'cart') document.getElementById('cartSection')?.classList.remove('hidden');
  if (section === 'orders') document.getElementById('orderSection')?.classList.remove('hidden');
}

// ===== AUTH UI =====
export function setupAuthUI() {
  const user = getCurrentUser();
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  document.getElementById('logoutBtn').classList.toggle('hidden', !isLoggedIn);
  document.getElementById('showLoginBtn').classList.toggle('hidden', isLoggedIn);
  document.getElementById('showRegisterBtn').classList.toggle('hidden', isLoggedIn);
  document.getElementById('productsTab').classList.toggle('hidden', !isLoggedIn);
  document.getElementById('cartIcon').classList.toggle('hidden', !isLoggedIn || isAdmin);
  document.getElementById('orderIcon').classList.toggle('hidden', !isLoggedIn || isAdmin);
  document.getElementById('authFormContainer').classList.toggle('hidden', isLoggedIn);
  adminPanel.classList.toggle('hidden', !isAdmin);
}

export function showAdminPanel() {
  const user = getCurrentUser();
  if (user?.role === 'admin') adminPanel.classList.remove('hidden');
}

// ===== PRODUCTS =====
export function renderProducts(products = [], reloadCallback = () => {}) {
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';
  productList.innerHTML = '';
  editFormContainer.innerHTML = '';
  editFormContainer.classList.add('hidden');

  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const image = product.image || 'https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg';
    card.innerHTML = `
      <img src="${image}" alt="${product.name}" class="product-card__image" />
      <h1 class="product-card__title">${product.name}</h1>
      <h3 class="product-card__price">₹${product.price}</h3>
    `;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';

    if (isAdmin) {
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'product-card__btn';
      editBtn.onclick = () => showEditForm(product, reloadCallback);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'product-card__btn';
      deleteBtn.onclick = async () => {
        if (confirm('Delete this product?')) {
          await deleteProduct(product.id);
          await reloadCallback();
        }
      };

      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(deleteBtn);
    } else {
      const addToCartBtn = document.createElement('button');
      addToCartBtn.textContent = 'Add to Cart';
      addToCartBtn.className = 'product-card__btn';
      addToCartBtn.onclick = async () => {
        await addToCart(product.id); // ✅ pass only ID
        alert('✅ Added to cart!');
        await renderCart();
        showOnly('cart');
        trackEvent('add_to_cart', { productId: product.id });
      };
      btnGroup.appendChild(addToCartBtn);
    }

    card.appendChild(btnGroup);
    productList.appendChild(card);
  });
}

// ===== ADMIN EDIT FORM =====
function showEditForm(product, reloadCallback) {
  editFormContainer.innerHTML = `
    <h3 class="admin-panel__title">Edit Product #${product.id}</h3>
    <form id="editProductForm" class="admin-panel">
      <div class="form-group">
        <label for="editName">Name</label>
        <input type="text" id="editName" value="${product.name}" required />
      </div>
      <div class="form-group">
        <label for="editPrice">Price</label>
        <input type="number" id="editPrice" value="${product.price}" required />
      </div>
      <div class="form-group">
        <label for="editImage">Image URL</label>
        <input type="url" id="editImage" value="${product.image}" required />
      </div>
      <button type="submit">Update Product</button>
    </form>
  `;
  editFormContainer.classList.remove('hidden');

  document.getElementById('editProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const updated = {
      name: document.getElementById('editName').value,
      price: +document.getElementById('editPrice').value,
      image: document.getElementById('editImage').value,
    };
    await updateProduct(product.id, updated);
    editFormContainer.classList.add('hidden');
    await reloadCallback();
  });
}

// ===== CART =====
export async function renderCart() {
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');

  cartList.innerHTML = '';
  if (cartTotal) cartTotal.innerHTML = '';

  const items = await getCart();
  if (!items || items.length === 0) {
    cartList.innerHTML = '<li>🛒 Cart is empty.</li>';
    return;
  }

  let total = 0;
  const validItems = [];

  items.forEach(item => {
    const qty = item.quantity || 1;
    const subtotal = item.price * qty;
    total += subtotal;

    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="cart-item-left">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <span class="cart-item-name">${item.name}</span>
      </div>
      <div class="cart-item-middle">₹${item.price} × ${qty} = ₹${subtotal}</div>

    `;

    const controls = document.createElement('div');
    controls.className = 'cart-item-controls';

    const incBtn = document.createElement('button');
    incBtn.textContent = '+';
    incBtn.onclick = async () => {
      try {
        await updateCartItem(item.product_id || item.id, qty + 1);
        renderCart();
      } catch (err) {
        alert('Error updating cart item');
      }
    };


    const decBtn = document.createElement('button');
    decBtn.textContent = '-';
    decBtn.disabled = qty <= 1;
    decBtn.onclick = async () => {
      if (qty > 1) {
        await updateCartItem(item.product_id || item.id, qty - 1);
        renderCart();
      }
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.onclick = async () => {
      console.log('Trying to delete productId:', item.product_id || item.id); 
      await deleteCartItem(item.product_id || item.id); 
      renderCart();
    };

    controls.appendChild(incBtn);
    controls.appendChild(decBtn);
    controls.appendChild(delBtn);
    li.appendChild(controls);
    cartList.appendChild(li);
    

    validItems.push({ ...item, quantity: qty });
  });

  if (cartTotal) {
    cartTotal.textContent = `🧾 Total: ₹${total}`;
  }
  
  localStorage.setItem('cartForOrder', JSON.stringify(validItems));
}

// ===== ORDERS =====
export async function renderOrders() {
  orderList.innerHTML = '';
  const orders = await getOrders();

  if (!orders || orders.length === 0) {
    orderList.innerHTML = '<li>📦 No past orders.</li>';
    return;
  }

  orders.forEach(order => {
    const li = document.createElement('li');
    li.classList.add('order-item');
    li.innerHTML = `
      <div class="order-header">
        <strong>Order #${order.id}</strong>
        <span class="order-date">${new Date(order.created_at).toLocaleString()}</span>
      </div>
      <div class="order-total">Total: <strong>₹${order.total}</strong></div>
      <ul class="order-products">
        ${order.items.map(i => `
          <li class="order-product">
            <img src="${i.image}" alt="${i.name}" />
            <span class="product-details">${i.name} — ₹${i.price} x ${i.quantity}</span>
          </li>
        `).join('')}
      </ul>
    `;
    orderList.appendChild(li);

  });
}
