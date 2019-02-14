const groupDb = require('../../helpers/groupModel.js');

module.exports = {
  type: 'DELETE',
  url: '/api/group/:id',
  handler: (req, res) => {
    const { id } = req.params;
    groupDb.remove(id)
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
  },
  //protected: true
}
