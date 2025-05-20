// Complete E-Commerce Backend in Node.js with Express (Mocked DB)
// index.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// ---------------------- MOCK DATABASE ----------------------
const products = [
  { id: 1, name: 'iPhone 13', price: 999 },
  { id: 2, name: 'Samsung Galaxy S21', price: 899 },
  { id: 3, name: 'OnePlus 9', price: 729 }
];

const users = [];
const orders = [];
const carts = {}; // key = userId, value = array of products

// ---------------------- UTILITIES ----------------------
const mockPayment = () => 'Success';

// ---------------------- MIDDLEWARE ----------------------
const authenticate = (req, res, next) => {
  const { user_id } = req.headers;
  const user = users.find(u => u.user_id === user_id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
};

// ---------------------- PRODUCT ROUTES ----------------------
app.get('/api/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);
  res.json({ data: paginated, page, total: products.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// ---------------------- USER ROUTES ----------------------
app.post('/api/users/register', (req, res) => {
  const { user_id, password } = req.body;
  if (users.some(u => u.user_id === user_id)) return res.status(400).json({ error: 'User exists' });
  users.push({ user_id, password });
  res.status(201).json({ message: 'User registered' });
});

app.post('/api/users/login', (req, res) => {
  const { user_id, password } = req.body;
  const user = users.find(u => u.user_id === user_id && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful', user_id });
});

// ---------------------- CART ROUTES ----------------------
app.post('/api/cart', authenticate, (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (!carts[req.user.user_id]) carts[req.user.user_id] = [];
  carts[req.user.user_id].push(product);
  res.json({ message: 'Product added to cart' });
});

app.get('/api/cart', authenticate, (req, res) => {
  res.json({ cart: carts[req.user.user_id] || [] });
});

// ---------------------- ORDER ROUTES ----------------------
app.post('/api/orders', authenticate, (req, res) => {
  const userId = req.user.user_id;
  const userCart = carts[userId] || [];
  if (userCart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const order = {
    id: orders.length + 1,
    user_id: userId,
    items: userCart,
    total: userCart.reduce((sum, p) => sum + p.price, 0),
    paymentStatus: mockPayment(),
    createdAt: new Date()
  };
  orders.push(order);
  carts[userId] = []; // clear cart
  res.status(201).json({ message: 'Order placed', order });
});

app.get('/api/orders', authenticate, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const userOrders = orders.filter(o => o.user_id === req.user.user_id);
  const start = (page - 1) * limit;
  const paginated = userOrders.slice(start, start + limit);
  res.json({ orders: paginated, page, total: userOrders.length });
});

// ---------------------- START SERVER ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n🚀 Server running on http://localhost:${PORT}`));