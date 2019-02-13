const bcrypt = require('bcryptjs');
const userDb = require('../../helpers/user.js');
//const { auth } = require('../../auth/user.js');

module.exports = {
  type: 'POST',
  url: '/api/user/login/',
  handler: (req, res) => {
    const user = req.body;
    // if add validators, promise.all goes here
    userDb.getUserForLogin(user.id)
      .then((returnedUser) => {
        if (returnedUser && bcrypt.compareSync(user.password, returnedUser.password)) {
          const token = auth.generateToken(user);
          res.status(201).json({ 
            id: returnedUser.id, 
            token 
          });
        } else {
          res.status(400).json({ error: 'Not authenticated.' });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Error verifying user in database.' });
      });
  },
};