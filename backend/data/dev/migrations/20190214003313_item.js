exports.up = function(knex, Promise) {
    return knex.schema.createTable('items', (table) => {
        // initialize user table db rows

        //auto-increment primary key for table i.e. item ID
        table.increments('id');
        table.string('name', 255).notNullable();
        table.integer('purchasedBy').references('id').inTable('users');
        table.integer('groupId').references('id').inTable('groups').notNullable();
        table.boolean('purchased').defaultTo(false);
        table.float('price').notNullable();
        table.integer('quantity').notNullable();
        table.string('measurement', 255);
        table.date('purchasedOn');

        // will eventually be a foreign key when category table is created
        table.string('category', 255).references('category').inTable('categories');

        // timestamps the moment of user creation (i.e. registration date)
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        // notes the time changes are made to a user profile
        table.timestamp('updatedAt').defaultTo(knex.fn.now());

    });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('items');
};
