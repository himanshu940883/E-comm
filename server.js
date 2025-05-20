const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());

const products = [
   { id : 1, name : "Iphone 11", color: 'black', price : 2345},
   { id : 2, name : "Iphone 12", color: 'titanium', price : 12345},
   { id : 3, name : "Iphone 13", color: 'grey', price : 5432},
   { id : 4, name : "Iphone 14", color: 'orange', price : 42356},
   { id : 5, name : "Iphone 15", color: 'green', price : 2345},
]

const users = [];
const orders = [];
const carts = {};

const mockPayment = () => 'Success';

const authenticate = (req, res, next) => {
  const { user_id } = req.headers;
  const user = users.find(u => u.user_id === user_id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
};



// PRODUCTS
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});




// USERS
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




// CARTS
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








// ORDERS
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


app.get('/api/test-payment', (req, res) => {
  const status = mockPayment();
  res.json({ paymentStatus: status });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




