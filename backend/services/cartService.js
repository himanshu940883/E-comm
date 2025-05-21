const { carts, products } = require('../models/mockDB');

exports.add = (user_id, productId) => {
  const product = products.find(p => p.id === productId);
  if (!product) return { error: 'Product not found' };
  if (!carts[user_id]) carts[user_id] = [];
  carts[user_id].push(product);
  return { message: 'Product added to cart' };
};

exports.get = (user_id) => {
  return carts[user_id] || [];
};
