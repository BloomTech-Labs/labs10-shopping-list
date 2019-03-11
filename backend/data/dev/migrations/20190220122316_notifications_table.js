exports.up = function(knex, Promise) {
    return knex.schema.createTable('notifications', (table) => {
        table.increments('id');
        table.integer('userID').references('id').inTable('users').onDelete("CASCADE").notNullable();
        table.integer('groupID').references('id').inTable('groups').onDelete("CASCADE").notNullable();
        table.string('userName').notNullable();
        table.string('groupName').notNullable();
        table.string('action').notNullable();
        table.string('content').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());

    });

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('notifications');
};
