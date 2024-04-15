const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const secret = 'your-secret-key';
    console.log('User is-->'+user);
    return jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
  };
  const verifyToken = (token) => {
    const secret = 'your-secret-key';
    return jwt.verify(token, secret);
  };
  module.exports = { generateToken, verifyToken };