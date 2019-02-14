const ValidationError = require('../validationError');

module.exports = {
  name: ({ name }) => {
    if (name === '' || typeof name !== 'string' || name.length > 128) {
      throw new ValidationError('Invalid name.');
    }
    return true;
  },
  userId: ({ userId }) => {
    return true;
  },
  token: ({ token }) => {
    return true;
  },
};
