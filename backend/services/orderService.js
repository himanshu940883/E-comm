const db = require('../config/db'); 

const mockPayment = () => 'Success';

exports.create = async (user_id) => {
  try {
    return await db.transaction(async trx => {
      const cartItems = await trx('carts')
        .join('products', 'carts.product_id', 'products.id')
        .select(
          'carts.product_id',
          'carts.quantity',
          'carts.price',
          'products.name',
          'products.image'
        ) .where('carts.user_id', user_id);

      if (cartItems.length === 0) { return { error: 'Cart is empty' }; }
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // // Create order
      // const [order] = await trx('orders')
      //   .insert({
      //     user_id,
      //     total,
      //     payment_status: mockPayment(),
      //     created_at: new Date()
      //   })
      //   .returning('*');

      // // Insert into order
      // const orderItems = cartItems.map(item => ({
      //   user: order.id,
      //   product_id: item.product_id,
      //   price: item.price,
      //   quantity: item.quantity,
      // }));

      // // await trx('orders').insert(orderItems);

      const orderItems = cartItems.map(item => ({
        product_id: item.product_id,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
        image: item.image
      }));

const [order] = await trx('orders')
  .insert({
    user_id,
    total,
    payment_status: mockPayment(),
    created_at: new Date(),
    items: JSON.stringify(orderItems) 
  })
  .returning('*');
      await trx('carts').where({ user_id }).del();

      return { message: 'Order placed successfully', order };
    });
  } catch (err) {
    console.error('Error creating order:', err);
    return { error: 'Failed to place order. Please try again later.' };
  }
};

exports.getAll = async (user_id, page, limit) => {
  try {
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const offset = (parsedPage - 1) * parsedLimit;

    const orders = await db('orders')
      .where({ user_id })
      .orderBy('created_at', 'desc')
      .limit(parsedLimit)
      .offset(offset)
      .select();

    const [{ count }] = await db('orders')
      .where({ user_id })
      .count('id as count');

    return {
      orders,
      total: parseInt(count),
      page: parsedPage,
      limit: parsedLimit
    };
  } catch (err) {
    console.error('Error fetching orders:', err);
    return { error: 'Failed to fetch orders. Please try again later.' };
  }
};
