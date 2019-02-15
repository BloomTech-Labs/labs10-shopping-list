const express = require('express');
const fakeRouter = express.Router();
const faker = require('faker');
const userDb = require('../../helpers/userModel.js');

fakeRouter.get('/users', (req, res) => {
    // console.log(req.body);
    for(let i = 0; i < 250; i++) {
      const name = faker.name.findName();
      const email = faker.internet.email();

      const newUser = {
        name,
        email
      };

      userDb.add(newUser)
        .then((id) => {
          console.log({id: id });
          // res.status(201).json( {id: id} );
        })
        .catch((err) => {
          console.log(err);
          // res.status(500).json({ error: 'Error saving new user to database.' });
        });
    }

    res.status(201).json( {"message": "250 users created!"} );


    // res.send('This is the /user root endpoint.');
});

module.exports = fakeRouter;
