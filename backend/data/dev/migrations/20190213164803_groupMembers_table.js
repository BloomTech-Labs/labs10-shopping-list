/*
  * Create the 'groupMembers' table and initilize each column
  * This will handle defining each group created.
*/
exports.up = function(knex, Promise) {
  return knex.schema.createTable('groupMembers', function(tbl) {
    tbl.increments('id');

    tbl.integer('userID').references('id').inTable('users').onDelete("CASCADE").notNullable();
    tbl.integer('groupID').references('id').inTable('groups').onDelete("CASCADE").notNullable();
    tbl.boolean('moderator').defaultTo(false);
    tbl.boolean('weeklyNotification').defaultTo(true);
    tbl.boolean('monthlyNotification').defaultTo(true);
    tbl.float('total').defaultTo(0.00);
    tbl.float('net').defaultTo(0.00);
    tbl.timestamp('createdAt').defaultTo(knex.fn.now());
    tbl.timestamp('updatedAt').defaultTo(knex.fn.now());
  })

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('groupMembers');
};
