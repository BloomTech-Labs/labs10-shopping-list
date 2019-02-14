module.exports = {
  type: 'GET',
  url: '/api/auth/success/',
  handler: (req, res) => {
    res.send('Login successful!');
  },
};
