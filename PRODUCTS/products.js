class ProductService {
  constructor() {
    this.products = [
      { id: 1, name: "Iphone 11", color: 'black', price: 2345 },
      { id: 2, name: "Iphone 12", color: 'titanium', price: 12345 },
      { id: 3, name: "Iphone 13", color: 'grey', price: 5432 },
      { id: 4, name: "Iphone 14", color: 'orange', price: 42356 },
      { id: 5, name: "Iphone 15", color: 'green', price: 2345 },
    ];
  }

  listProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(p => p.id === id);
  }
}

module.exports = ProductService;
