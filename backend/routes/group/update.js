const groupDb = require('../../helpers/group.js');
const validators = require('../../validators/group/create.js');

module.exports = {
  type: 'PUT',
  url: '/group/:id',
  handler: (req, res) => {
    const {id} = req.params;
    let modififedGroup = { 
      userId,
      name,
      token,
    } = req.body;
    const changedKeys = Object.keys(modififedGroup);
    const validations = changedKeys.map(key => validators[key](modififedGroup));
    Promise.all(validations).then(() => {
      groupDb.update(id, modififedGroup)
      .then(response => {
        if(response === undefined){
          res.status(404).json({message: "Group not found."});
        }else{
          res.status(200).json({ modififedGroup });
        }
      })
      .catch(err => {
        res.status(500).json({ error: "The group could not be retrieved." });
      });
    }).catch(err => res.status(err.statusCode || 500).json(err.message));
  },
  //protected: true
}