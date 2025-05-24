const service = require('../services/productService');

exports.getAllProducts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const data = await service.getPaginatedProducts(page, limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await service.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

exports.addProduct = async (req, res) => {
  console.log('[DEBUG] req.user:', req.user);
  console.log('[DEBUG] req.user.role:', req.user.role);
  console.log('[DEBUG] req.body:', req.body);

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  try {
    const result = await service.addProduct(req.body);
    if (result.error) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};

exports.updateProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  try {
    const result = await service.updateProduct(req.params.id, req.body);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  try {
    const result = await service.deleteProduct(req.params.id);
    if (result.error) return res.status(404).json(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
