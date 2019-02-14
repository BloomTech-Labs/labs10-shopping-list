const userDb = require('../../helpers/userModel.js');

module.exports = {
  type: 'DELETE',
  url: '/api/user/:id',
  handler: (req, res) => {
    const { id } = req.params;
    userDb.remove(id)
    .then(numRemoved => {
      if(numRemoved === 1){
      res.status(202).json({message: "User successfully deleted."});
    }else{
      res.status(202).json({message: "Request accepted but no object deleted."});
    }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The User could not be removed." });
    });
  }
};
