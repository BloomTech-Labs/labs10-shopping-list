
exports.up = function(knex, Promise) {
    return knex.schema.createTable('invitations', function(tbl){
        tbl.increments('id');

        tbl.string('inviteCode', 255).notNullable().unique(); // the random code that identifies the invitation

        tbl.integer('groupID').references('id').inTable('groups').notNullable(); // the id of the group the invitation is to

        tbl.string('groupName').notNullable(); // the group name being invited to

        tbl.integer('userID').references('id').inTable('users').notNullable(); // the id of the user who made the invitation

        tbl.string('userName').notNullable(); // the name of the user sending the invitation

        tbl.date('expiration').defaultTo(knex.fn.now() + (60 * 60 * 24 * 7)); // set expiration in 1 week

        tbl.boolean('usedBefore').defaultTo(false); // checks if the code has been visited before

        tbl.timestamp('createdAt').defaultTo(knex.fn.now());

        tbl.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('invitations');
};
