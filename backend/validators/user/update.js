const ValidationError = require('../validationError');

module.exports = {
  name: ({ name }) => {
    if (name === '' || typeof name !== 'string' || name.length > 128) {
      throw new ValidationError('Invalid name.');
    }
    return true;
  },
  password: ({ password }) => {
    if (password === '' || typeof password !== 'string' || password.length > 128) {
      throw new ValidationError('Invalid password.');
    }
    return true;
  },
  email: ({ email }) => {
    return true;
  },
  user_type: ({ profilePicture }) => {
    return true;
  },
  first_name: ({ emailNotifications }) => {
    return true;
  },
  last_name: ({ role }) => {
    return true;
  },
  tagline: ({ subscriptionType }) => {
    return true;
  },
};
