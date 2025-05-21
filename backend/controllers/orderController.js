const service = require('../services/orderService');

exports.placeOrder = (req, res) => {
  const result = service.create(req.user.user_id);
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
};

exports.getOrders = (req, res) => {
  const { page, limit } = req.query;
  const result = service.getAll(req.user.user_id, page, limit);
  res.json(result);
};
