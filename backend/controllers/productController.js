const service = require('../services/productService');

exports.getAllProducts = (req, res) => {
  const { page, limit } = req.query;
  const data = service.getPaginatedProducts(page, limit);
  res.json(data);
};

exports.getProductById = (req, res) => {
  const product = service.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};
