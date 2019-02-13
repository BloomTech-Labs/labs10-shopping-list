const userDb = require('../../helpers/user.js');

module.exports = {
  type: 'GET',
  url: '/api/users/',
  handler: (req, res) => {
    userDb.get()
      .then((users) => {
        res.status(200).json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: 'Could not retrieve users.' });
      });
  },
  //protected: true,
};
