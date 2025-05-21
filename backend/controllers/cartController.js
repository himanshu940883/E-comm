const service = require('../services/cartService');

exports.addToCart = (req, res) => {
  const result = service.add(req.user.user_id, req.body.productId);
  if (result.error) return res.status(404).json(result);
  res.json(result);
};

exports.viewCart = (req, res) => {
  res.json({ cart: service.get(req.user.user_id) });
};
