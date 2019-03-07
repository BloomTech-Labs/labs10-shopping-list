
exports.up = function(knex, Promise) {
    return knex.schema.table('notifications', (table) => {
        table.integer('groupID').references('id').inTable('groups').notNullable();
        table.string('userName').notNullable();
        table.string('groupName').notNullable();
        table.string('action').notNullable();

    });
};

exports.down = function(knex, Promise) {
    return knex.schema.createTable('notifications', (table) => {
        table.increments('id');
        table.integer('userID').references('id').inTable('users').notNullable();
        table.string('content').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());

    });
};
