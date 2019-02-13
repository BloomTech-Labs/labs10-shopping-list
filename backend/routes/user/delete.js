const userDb = require('../../helpers/user.js');

module.exports = {
  type: 'DELETE',
  url: '/api/user/:id',
  handler: (req, res) => {
    const { id } = req.params;
    userDb.get(id)
    .then(user => {
        if (user != undefined) {
          user.remove(id)
          .then(numRemoved => {
            if(numRemoved === 1){
            res.status(202).json({message: "User successfully deleted."});
          }else{
            res.status(202).json({message: "Request accepted but no object deleted."});
          }
          })
          .catch(err => {
            res.status(500).json({ error: "The User could not be removed." });
          });
        }else{
          res.status(404).json({ message: "The User with the specified ID does not exist." });
        }
    })
    .catch(err => {
      res.status(500).json({ error: "The User information could not be retrieved." });
    })
  }
}
