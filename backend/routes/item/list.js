const itemDb = require('../../helpers/item.js');

module.exports = {
  type: 'GET',
  url: '/api/items/',
  handler: (req, res) => {
    itemDb.get()
      .then((items) => {
        res.status(200).json({ items });
      })
      .catch((err) => {
        res.status(500).json({ error: 'Could not retrieve items.' });
      });
  },
  //protected: true,
};
