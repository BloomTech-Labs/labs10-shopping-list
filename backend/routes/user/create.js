const userDb = require('../../helpers/userModel.js');
const validators = require('../../validators/user/create.js');

module.exports = {
  type: 'POST',
  url: '/api/user/',
  handler: (req, res) => {
    const newUser = { 
      name,
      email,
      profilePicture,
      subscriptionType,
    } = req.body;
    const newKeys = Object.keys(newUser);
    const validations = newKeys.map(key => validators[key](newUser));
    Promise.all(validations).then(() => {
      userDb.add(newUser)
        .then((id) => {
          res.status(201).json( {id: id} );
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Error saving new user to database.' });
        });
    }).catch(err => res.status(err.statusCode || 500).json(err.stack));
  },
};
