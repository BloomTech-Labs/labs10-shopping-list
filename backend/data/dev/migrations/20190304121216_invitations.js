
exports.up = function(knex, Promise) {
    return knex.schema.createTable('invitations', function(tbl){
        tbl.increments('id');

        tbl.string('inviteCode', 255).notNullable().unique(); // the random code that identifies the invitation

        tbl.integer('groupID').references('id').inTable('groups').notNullable(); // the id of the group the invitation is to

        tbl.integer('userID').references('id').inTable('users').notNullable(); // the id of the user who made the invitation

        tbl.string('invitee').notNullable(); // the email of the person receiving the invitation

        tbl.datetime('expiration').notNullable(); // pass invite expiration upon creation

        tbl.boolean('usedBefore').defaultTo(false); // checks if the code has been visited before

        tbl.timestamp('createdAt').defaultTo(knex.fn.now());

        tbl.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('invitations');
};
