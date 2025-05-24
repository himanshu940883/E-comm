import { getCurrentUser } from './auth.js';

const API_BASE = 'http://localhost:5000/api';

// ======================== PRODUCTS ========================
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Unable to fetch products');
  const data = await res.json();
  return data.data || []; 
}

export async function addProduct(name, price, image) {
  const user = getCurrentUser();
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'user_id': user.user_id
    },
    body: JSON.stringify({ name, price, image })
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json();
}

export async function updateProduct(id, updatedData) {
  const user = getCurrentUser();
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'user_id': user.user_id
    },
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error('Failed to update product');
  return await res.json();
}

export async function deleteProduct(id) {
  const user = getCurrentUser();
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'user_id': user.user_id
    }
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

// ======================== CART ========================


export async function getCartItemById(productId) {
  const user = getCurrentUser();
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'GET',
    headers: {
      'user_id': user.user_id
    }
  });
  if (!res.ok) throw new Error('Failed to fetch cart item');
  return res.json();
}













export async function addToCart(productId) {
  const user = getCurrentUser();
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'user_id': user.user_id
    },
    body: JSON.stringify({ productId })
  });
  if (!res.ok) throw new Error('Failed to add to cart');
  return res.json();
}


export async function updateCartItem(productId, quantity) {
  const user = getCurrentUser();
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'user_id': user.user_id
    },
    body: JSON.stringify({ quantity })
  });
  if (!res.ok) throw new Error('Failed to update cart item');
  return res.json();
}

// export async function deleteCartItem(productId) {
//   const user = getCurrentUser();
//   const res = await fetch(`${API_BASE}/cart/${productId}`, {
//     method: 'DELETE',
//     headers: {
//       'user_id': user.user_id
//     }
//   });
//   if (!res.ok) throw new Error('Failed to delete cart item');
//   return res.json();
// }

export async function deleteCartItem(productId) {
  if (!productId) {
    console.error('deleteCartItem called with undefined productId');
    return;
  }

  const user = getCurrentUser();
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'DELETE',
    headers: {
      'user_id': user.user_id
    }
  });

  if (!res.ok) throw new Error('Failed to delete cart item');
  return res.json();
}


export async function getCart() {
  const user = getCurrentUser();
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'GET',
    headers: {
      'user_id': user.user_id
    }
  });
  if (!res.ok) throw new Error('Failed to get cart');
  const data = await res.json();
  return data.cart || [];
}

// ======================== ORDERS ========================
export async function placeOrder(cartItems) {
  const user = getCurrentUser();
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'user_id': user.user_id
    },
    body: JSON.stringify({ items: cartItems })
  });
  if (!res.ok) throw new Error('Failed to place order');
  return res.json();
}

export async function getOrders() {
  const user = getCurrentUser();
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'GET',
    headers: {
      'user_id': user.user_id
    }
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();

  const orders = data.orders || [];

  orders.forEach(order => {
    if (typeof order.items === 'string') {
      try {
        order.items = JSON.parse(order.items);
      } catch {
        order.items = [];
      }
    }
  });

  return orders;
  // if (!res.ok) throw new Error('Failed to fetch orders');
  // const data = await res.json();
  // return data.orders || [];
}
