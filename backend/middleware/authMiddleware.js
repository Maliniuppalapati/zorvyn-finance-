const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * STEP 1: PROTECT MIDDLEWARE
 * Verifies the JWT and attaches the full User object to the Request
 */
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🌟 Fetch user and ensure 'role' is included (exclude only password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next(); // Move to the next function (Authorize or Controller)
    } catch (error) {
      console.error("Auth Error:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

/**
 * STEP 2: AUTHORIZE MIDDLEWARE
 * Checks if the user's role matches the required permission
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // 🛡️ Ensure user exists and role matches (Case-Insensitive check)
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Convert everything to lowercase for a "Bulletproof" comparison
    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Forbidden: Role '${req.user.role}' is not allowed to access this resource.` 
      });
    }

    next(); // Permission granted!
  };
};