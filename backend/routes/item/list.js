const itemDb = require('../../helpers/itemModel.js');

module.exports = {
  type: 'GET',
  url: '/api/items/:groupId',
  handler: (req, res) => {
    itemDb.getByGroup(req.params.groupId)
      .then((items) => {
        res.status(200).json({ items });
      })
      .catch((err) => {
        res.status(500).json({ error: 'Could not retrieve items.' });
      });
  },
  // protected: true,
};
