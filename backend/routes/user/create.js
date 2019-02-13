const bcrypt = require('bcryptjs');
const userDb = require('../../helpers/user.js');
const validators = require('../../validators/user/create.js');
//const { auth } = require('../../auth/user.js');

/*
function generateToken(user) {
  const payload = {
    username: user.username,
  };
  const { JSW_SECRET: secret } = process.env;
  const options = {
    expiresIn: '10m',
  };
  return jwt.sign(payload, secret, options);
}*/

module.exports = {
  type: 'POST',
  url: '/api/user/',
  handler: (req, res) => {
    const newUser = { 
      name,
      email,
      password,
      profilePicture,
      subscriptionType,
    } = req.body;
    const newKeys = Object.keys(newUser);
    const validations = newKeys.map(key => validators[key](newUser));
    Promise.all(validations).then(() => {
      const hash = bcrypt.hashSync(newUser.password, 14);
      newUser.password = hash;
      userDb.insert(newUser)
        .then((id) => {
          res.status(201).json( {id: id/*, token: auth.generateToken(newUser) */);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Error saving new user to database.' });
        });
    }).catch(err => res.status(err.statusCode || 500).json(err.stack));
  },
};

/*
{
  "username": "test2",
  "password": "password",
  "email": "test2@test2.com",
  "first_name": "john",
  "last_name": "smith",
  "user_type": "guest",
  "tagline": "howdy"
}
 */