const userDb = require('../../helpers/userModel.js');

module.exports = {
  type: 'GET',
  url: '/api/user/:id',
  handler: (req, res) => {
    userDb.getById(req.params.id)
      .then(user => {
        if(user != undefined){
          res.status(200).json({ user });
        }else{
          res.status(404).json({ error: "User not found." });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Could not retrieve user." });
      });
  },
  // protected: true,*/
};