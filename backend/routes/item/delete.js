const itemDb = require('../../helpers/item.js');

module.exports = {
  type: 'DELETE',
  url: '/api/item/:id',
  handler: (req, res) => {
    const { id } = req.params;
    itemDb.get(id)
    .then(item => {
        if (item != undefined) {
          item.remove(id)
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
        }else{
          res.status(404).json({ message: "The item with the specified ID does not exist." });
        }
    })
    .catch(err => {
      res.status(500).json({ error: "The item information could not be retrieved." });
    })
  }
  //protected: true
}
