const ValidationError = require('../validationError');

module.exports = {
  name: ({ name }) => {
    if (name === '' || typeof name !== 'string' || name.length > 128) {
      throw new ValidationError('Invalid name.');
    }
    return true;
  },
  purchasedBy: ({ purchasedBy }) => {
    return true;
  },
  groupId: ({ groupId }) => {
    return true;
  },
  purchased: ({ purchased }) => {
    return true;
  },
  price: ({ price }) => {
    return true;
  },
  quantity: ({ quantity }) => {
    return true;
  },
  measurement: ({ measurement }) => {
    return true;
  },
  category: ({ category }) => {
    return true;
  },
  purchasedOn: ({ purchasedOn }) => {
    return true;
  },
};
