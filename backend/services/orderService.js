const { carts, orders } = require('../models/mockDB');

const mockPayment = () => 'Success';

exports.create = (user_id) => {
  const userCart = carts[user_id] || [];
  if (userCart.length === 0) return { error: 'Cart is empty' };

  const order = {
    id: orders.length + 1,
    user_id,
    items: userCart,
    total: userCart.reduce((sum, p) => sum + p.price, 0),
    paymentStatus: mockPayment(),
    createdAt: new Date()
  };

  orders.push(order);
  carts[user_id] = [];

  return { message: 'Order placed', order };
};

exports.getAll = (user_id, page, limit) => {
  const userOrders = orders.filter(o => o.user_id === user_id);
  if (page && limit) {
    const start = (parseInt(page) - 1) * parseInt(limit);
    return {
      orders: userOrders.slice(start, start + parseInt(limit)),
      total: userOrders.length,
      page: parseInt(page)
    };
  }
  return { orders: userOrders };
};
