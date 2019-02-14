const itemDb = require('../../helpers/itemModel.js');
const validators = require('../../validators/item/create.js');

module.exports = {
  type: 'POST',
  url: '/api/item/',
  handler: (req, res) => {
    const newItem = { 
      name,
      purchasedBy,
      groupId,
      purchased,
      price,
      quantity,
      measurement,
      category,
      purchasedOn,
    } = req.body;
    const newKeys = Object.keys(newItem);
    const validations = newKeys.map(key => validators[key](newItem));
    Promise.all(validations).then(() => {
      itemDb.add(newItem)
        .then((id) => {
          res.status(201).json({ id });
        })
        .catch((err) => {
          res.status(500).json({ error: 'Error saving new item to database.' });
        });
    }).catch(err => res.status(err.statusCode || 500).json(err.stack));
  },
  // protected: true
};