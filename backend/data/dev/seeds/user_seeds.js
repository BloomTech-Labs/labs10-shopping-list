const faker = require('faker');

const createFakeUser = () => ({
  name: faker.name.findName(),
  email: faker.internet.email()
});

exports.seed = async function(knex, Promise) {
  let fakeUsers = [];
  const desiredFakeUsers = 500;
  for (let i = 0; i < desiredFakeUsers; i++) {
    fakeUsers.push(createFakeUser());
  }

  await knex("users").insert(fakeUsers);
}
