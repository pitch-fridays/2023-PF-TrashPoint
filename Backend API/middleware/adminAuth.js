// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'this_is_asecret'); 

    req.user = decoded;

    // Check if the user is an admin
    const user = await User.findById(decoded._id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
