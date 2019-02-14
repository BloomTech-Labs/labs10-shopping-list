const groupDb = require('../../helpers/groupModel.js');

module.exports = {
  type: 'GET',
  url: '/api/groups/',
  handler: (req, res) => {
    groupDb.get()
      .then((groups) => {
        res.status(200).json({ groups });
      })
      .catch((err) => {
        res.status(500).json({ error: 'Could not retrieve groups.' });
      });
  },
  //protected: true,
};
