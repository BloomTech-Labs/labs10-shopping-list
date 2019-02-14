const groupDb = require('../../helpers/groupModel.js');
const validators = require('../../validators/group/create.js');

module.exports = {
  type: 'POST',
  url: '/api/group/',
  handler: (req, res) => {
    const newGroup = { 
      userId,
      name,
      token,
    } = req.body;
    const newKeys = Object.keys(newGroup);
    const validations = newKeys.map(key => validators[key](newGroup));
    Promise.all(validations).then(() => {
      groupDb.add(newGroup)
        .then((id) => {
          res.status(201).json({ id });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Error saving new group to database.' });
        });
    }).catch(err => res.status(err.statusCode || 500).json(err.stack));
  },
  //protected: true
};