
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('subscriptions').del()
    .then(function () {
      // Inserts seed entries
      return knex('subscriptions').insert([
        {id: 1, name: 'Free', amount: 0.00},
        {id: 2, name: 'Premium', amount: 9}
      ]);
    });
};
