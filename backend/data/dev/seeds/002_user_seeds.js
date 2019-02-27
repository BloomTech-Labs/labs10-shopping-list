const faker = require('faker');

const createFakeUser = () => ({
  name: faker.name.findName(),
  email: faker.internet.email()
});

exports.seed = function(knex, promise) {
  let fakeUsers = [];
  const desiredFakeUsers = 50;
  for (let i = 0; i < desiredFakeUsers; i++) {
    fakeUsers.push(createFakeUser());
  }

  // Deletes ALL existing entries and resets primary keys
  return knex(`users`).del()
      .then(function () {
        // Inserts seed entries
        return knex(`users`).insert(fakeUsers);
      });
};
