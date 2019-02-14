
exports.up = function(knex, Promise) {
  return knex.schema.createTable('categories', (table) => {
      //have an unique ID for each category (done with increments)
      table.increments('id');

      // category name, will be constrained with uniqueness
      // since there is no point in having separate categories of the same thing
      table.string('category', 255).notNullable().unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('categories');
};
