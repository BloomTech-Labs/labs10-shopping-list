const userDb = require('../../helpers/userModel.js');
const validators = require('../../validators/user/update.js');

module.exports = {
  type: 'PUT',
  url: '/api/user/:id',
  handler: (req, res) => {
    const {id} = req.params;
    let modififedUser = { 
      name,
      email,
      profilePicture,
      subscriptionType,
    } = req.body;
    const changedKeys = Object.keys(modififedUser);
    const validations = changedKeys.map(key => validators[key](modififedUser));
    Promise.all(validations).then(() => {
      userDb.update(id, modififedUser)
      .then(response => {
        if(response === undefined){
          res.status(404).json({message: "User not found."});
        }else{
          res.status(200).json({ modififedUser });
        }
      })
      .catch(err => {
        res.status(500).json({ error: "The user could not be retrieved." });
      });
    }).catch(err => res.status(err.statusCode || 500).json(err.message));
  },
  // protected: true
};