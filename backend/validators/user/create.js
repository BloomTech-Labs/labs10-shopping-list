const ValidationError = require('../validationError');

module.exports = {
  name: ({ name }) => {
    if (name === '' || typeof name !== 'string' || name.length > 128) {
      throw new ValidationError('Invalid name.');
    }
    return true;
  },
  email: ({ email }) => {
    return true;
  },
  profilePicture: ({ profilePicture }) => {
    return true;
  },
  subscriptionType: ({ subscriptionType }) => {
    return true;
  },
};
