const groupDb = require('../../helpers/group.js');

module.exports = {
  type: 'DELETE',
  url: '/api/group/:id',
  handler: (req, res) => {
    const { id } = req.params;
    groupDb.get(id)
    .then(group => {
        if (group != undefined) {
          group.remove(id)
          .then(numRemoved => {
            if(numRemoved === 1){
            res.status(202).json({message: "Group successfully deleted."});
          }else{
            res.status(202).json({message: "Request accepted but no object deleted."});
          }
          })
          .catch(err => {
            res.status(500).json({ error: "The group could not be removed." });
          });
        }else{
          res.status(404).json({ message: "The group with the specified ID does not exist." });
        }
    })
    .catch(err => {
      res.status(500).json({ error: "The group information could not be retrieved." });
    })
  }
  //protected: true
}
