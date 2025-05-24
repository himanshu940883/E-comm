const db = require('../config/db');

exports.getPaginatedProducts = async (page, limit) => {
  const query = db('products');
  const countQuery = db('products').count('* as count');

  if (page && limit) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query.offset(offset).limit(limit);
  }

  const [data, countResult] = await Promise.all([query, countQuery]);
  return {
    data,
    total: parseInt(countResult[0].count),
    page: page ? parseInt(page) : undefined
  };
};

exports.getProductById = async (id) => {
  return await db('products').where({ id }).first();
};

exports.addProduct = async ({ name, price, image }) => {
  if (!name || !price) return { error: 'Name and price required' };
  try {
    const [product] = await db('products').insert({ name, price, image }).returning('*');
    return { message: 'Product added', product };
  } catch (err) {
    console.error('[DB ERROR] Add product failed:', err);
    return { error: 'Database insertion failed' };
  }

  // const [product] = await db('products').insert({ name, price, image }).returning('*');
  // return { message: 'Product added', product };
};

exports.updateProduct = async (id, data) => {
  const [product] = await db('products')
    .where({ id })
    .update(data)
    .returning('*');
  if (!product) return { error: 'Product not found' };
  return { message: 'Product updated', product };
};

exports.deleteProduct = async (id) => {
  const deleted = await db('products').where({ id }).del();
  if (!deleted) return { error: 'Product not found' };
  return { message: 'Product deleted' };
};
