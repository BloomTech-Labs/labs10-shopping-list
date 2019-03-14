
exports.up = function(knex, Promise) {
    return knex.schema.table('groupHistory', (table) => {
        table.string('purchasedOn').alter();
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.createTable('groupHistory', (table) => {
        table.increments('id');
        table.integer('userID').notNullable();
        table.integer('groupID').references('id').inTable('groups').onDelete("CASCADE").notNullable();
        table.integer('itemID').notNullable();
        table.string('imageURL', 255);
        table.float('total').notNullable();
        table.date('purchasedOn').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());

    });
};
