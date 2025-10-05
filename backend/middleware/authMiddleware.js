const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

const driverOnly = (req, res, next) => {
  if (req.user.role !== 'driver') {
    return res.status(403).json({ error: 'Access denied. Driver role required.' });
  }
  next();
};

const riderOnly = (req, res, next) => {
  if (req.user.role !== 'rider') {
    return res.status(403).json({ error: 'Access denied. Rider role required.' });
  }
  next();
};

module.exports = { authMiddleware, driverOnly, riderOnly };
