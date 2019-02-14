/*
  * Create the 'groups' table and initilize each column
  * This will handle defining each groupMember added.
*/
exports.up = function(knex, Promise) {
  return knex.schema.createTable('groups', function(tbl) {
    tbl.increments('id');

    tbl.integer('userID').references('id').inTable('users').notNullable();
    tbl.string('name').notNullable();
    tbl.string('token').nullable();
    tbl.timestamp('createdAt').defaultTo(knex.fn.now());
    tbl.timestamp('updatedAt').defaultTo(knex.fn.now());
    
  })

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('groups');
};
