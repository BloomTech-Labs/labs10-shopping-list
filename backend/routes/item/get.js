const itemDb = require('../../helpers/itemModel.js');

module.exports = {
  type: 'GET',
  url: '/api/item/:id',
  handler: (req, res) => {
    itemDb.getById(req.params.id)
      .then(item => {
        if(item != undefined){
          res.status(200).json({ item });
        }else{
          res.status(404).json({ error: "Item not found."});
        }
      })
      .catch(err => {
        res.status(500).json({ error: "Could not retrieve item." });
      })
  },
  // protected: true,
};