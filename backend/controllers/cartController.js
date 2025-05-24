const service = require('../services/cartService');
const knex = require('../config/knex');

exports.addToCart = async (req, res) => {
  const productId = req.params.productId;
  const user_id = req.user.user_id;

  try {
    const result = await service.add(req.user.user_id, req.body.productId);
    if (result.error) return res.status(404).json(result);
    res.json(result);
  } catch (err) {
    console.error('Error in addToCart:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

exports.viewCart = async (req, res) => {
  try {
    const cart = await service.get(req.user.user_id);
    res.json({ cart });
  } catch (err) {
    console.error('Error in viewCart:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};


exports.deleteCartItemById = async (req, res) => {
  const productId = req.params.productId;
  const user_id = req.user.user_id;

  try {
    const deleted = await knex('carts')
      .where({ product_id: productId, user_id })
      .del();

    if (deleted) {
      res.status(200).json({ message: 'Cart item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
};


exports.getCartItemById = async (req, res) => {
  const userId = req.user.user_id;
  const productId = req.params.productId;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }
  try {
    const result = await service.getByProductId(userId, productId);
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    res.json(result);
  } catch (err) {
    console.error('Error getting cart item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updateCartItem = async (req, res) => {
  const userId = req.user.user_id;
  const productId = req.params.productId;
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number' });
  }

  try {
    const result = await service.update(userId, productId, quantity);
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    res.json({ message: result.message });
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



