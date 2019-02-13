
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (table) => {
        // initialize user table db rows

        //auto-increment primary key for table i.e. user ID
        table.increments('id');

        // user email address, must be unique, multiple users cannot have the same email address
        table.string('email', 255).notNullable().unique();

        // user profile name
        table.string('name', 255).notNullable();

        // No password column is necessary since all authentication is handled through OAuth

        // user profile picture image url
        // defaults to an image of a shopping cart
        table.string('profilePicture', 255).defaultTo('https://i.imgur.com/M8kRKQC.png');

        // We need a way to secure this value from being changed by anyone but the systems administrator
        // assigns a foreign key integer to reference a subscription type as defined in the subscriptions table
        table.integer('subscriptionType').references('id').inTable('subscriptions').defaultTo(1);

        // timestamps the moment of user creation (i.e. registration date)
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        // notes the time changes are made to a user profile
        table.timestamp('updatedAt').defaultTo(knex.fn.now());

    });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
