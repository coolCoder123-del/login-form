const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get the token from the header
  const authHeader = req.header('Authorization');

  // Check if header is present
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Standard token format should be 'Bearer <token>'
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token format is invalid, must be Bearer <token>' });
  }

  const token = parts[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_auth_key_123_designed_by_antigravity');
    
    // Attach user payload to the request
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};
