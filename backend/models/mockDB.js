const products = [
  { id: 1, name: 'iPhone 16', price: 99999 },
  { id: 2, name: 'Samsung Galaxy S24', price: 89999 },
  { id: 3, name: 'OnePlus 13RT', price: 72999 },
  { id: 4, name: 'Nothing Phone 2', price: 69999 },
  { id: 5, name: 'OPPO Reno 9', price: 50999 },
  { id: 6, name: 'Vivo Y100', price: 39999 },
  { id: 7, name: 'Nokia G60', price: 10999 }
];

const users = [
  { user_id: "loki", password: "123", role: "user" },
  { user_id: "admin", password: "admin123", role: "admin" } 
];

const carts = {};
const orders = [];

module.exports = { products, users, carts, orders };
