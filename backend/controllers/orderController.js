const service = require('../services/orderService');

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await service.create(userId); 
    if (result.error) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
};




exports.getOrders = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await service.getAll(req.user.user_id, page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
