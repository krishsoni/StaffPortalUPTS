const  verifyToken  = require('../auth/auth.js');

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      try {
        console.log('Token is-->'+token);
        const user = verifyToken.verifyToken(token);
        console.log('User'+user.userId);
        req.user = user;
        next();
      } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
      }
    } else {
      res.status(401).json({ error: 'Token not provided' });
    }
  };
  module.exports =  requireAuth ;