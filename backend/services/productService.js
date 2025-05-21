const { products } = require('../models/mockDB');

exports.getPaginatedProducts = (page, limit) => {
  if (page && limit) {
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginated = products.slice(start, start + parseInt(limit));
    return { data: paginated, total: products.length, page: parseInt(page) };
  }
  return { data: products };
};

exports.getProductById = (id) => {
  return products.find(p => p.id == id);
};
