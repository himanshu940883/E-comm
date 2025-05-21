class CartService {
  constructor() {
    this.carts = {}; // { userId: [product, ...] }
  }

  addToCart(user_id, product) {
    if (!this.carts[user_id]) this.carts[user_id] = [];
    this.carts[user_id].push(product);
  }

  getCart(user_id) {
    return this.carts[user_id] || [];
  }

  clearCart(user_id) {
    this.carts[user_id] = [];
  }
}

module.exports = CartService;
