const itemDb = require('../../helpers/itemModel.js');

module.exports = {
  type: 'DELETE',
  url: '/api/item/:id',
  handler: (req, res) => {
    const { id } = req.params;
    itemDb.remove(id)
      .then(numRemoved => {
        if(numRemoved === 1){
          res.status(202).json({message: "Item successfully deleted."});
        }else{
          res.status(202).json({message: "Request accepted but no object deleted."});
        }
      })
      .catch(err => {
        res.status(500).json({ error: "The item could not be removed." });
      });
   },
  // protected: true
};
