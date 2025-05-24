const db = require('../config/db');

exports.add = async (user_id, productId) => {
  const product = await db('products').where({ id: productId }).first();
  if (!product) return { error: 'Product not found' };

  const existingItem = await db('carts')
    .where({ user_id, product_id: productId })
    .first();

  if (existingItem) {
    await db('carts')
      .where({ user_id, product_id: productId })
      .update({
        quantity: existingItem.quantity + 1
      });
  } else {
    await db('carts').insert({
      user_id,
      product_id: productId,
      quantity: 1,
      price: product.price,
      image: product.image
    });
  } return { message: 'Product added to cart' };
};

exports.get = async (user_id) => {
  const cartItems = await db('carts')
    .join('products', 'carts.product_id', 'products.id')
    .select(
      'products.id as product_id',
      'products.name',
      'carts.quantity',
      'carts.price',
      'carts.image'
    ) .where('carts.user_id', user_id);

  return cartItems;
};

exports.update = async (user_id, productId, quantity) => {
  const existingItem = await db('carts')
    .where({ user_id, product_id: productId })
    .first();

  if (!existingItem) return { error: 'Item not found in cart' };

  await db('carts')
    .where({ user_id, product_id: productId })
    .update({ quantity });
  return { message: 'Cart updated' };
};
















exports.getByProductId = async (user_id, productId) => {
  const item = await db('carts')
    .join('products', 'carts.product_id', 'products.id')
    .select(
      'products.id as product_id',
      'products.name',
      'carts.quantity',
      'carts.price',
      'carts.image'
    )
    .where('carts.user_id', user_id)
    .andWhere('carts.product_id', productId)
    .first();

  if (!item) return { error: 'Item not found in cart' };
  return item;
};
