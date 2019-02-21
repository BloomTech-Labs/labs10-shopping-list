exports.up = function(knex, Promise) {
    return knex.schema.createTable('groupHistory', (table) => {
        table.increments('id');
        table.integer('userID').references('id').inTable('users').notNullable();
        table.integer('groupID').references('id').inTable('groups').notNullable();
        table.integer('itemID').references('id').inTable('items').notNullable();
        table.string('imageURL', 255);
        table.float('total').notNullable();
        table.date('purchasedOn').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());

    });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('groupHistory');
};
