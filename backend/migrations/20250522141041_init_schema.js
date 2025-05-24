exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('user_id').unique().notNullable();
      table.string('password').notNullable();
      table.string('role').notNullable();
    })
    .createTable('products', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('price').notNullable();
    })
    .createTable('carts', table => {
      table.increments('id').primary();
      table.string('user_id').notNullable();
      table.integer('product_id').unsigned().notNullable();
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE');
      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    })
    .createTable('orders', table => {
      table.increments('id').primary();
      table.string('user_id').notNullable();
      table.json('items').notNullable();
      table.integer('total').notNullable();
      table.string('payment_status').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('orders')
    .dropTableIfExists('carts')
    .dropTableIfExists('products')
    .dropTableIfExists('users');
};

















exports.up = function(knex) {
  return knex.schema.createTable('order_items', table => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable();
    table.integer('product_id').unsigned().notNullable();
    table.integer('price').notNullable();
    table.integer('quantity').notNullable();

    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('order_items');
};


