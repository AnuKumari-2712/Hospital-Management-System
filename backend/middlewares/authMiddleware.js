const jwt = require('jsonwebtoken');

// Token validator core
const protect = (allowedModels) => {
  return async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.statusCode = 401;
      return next(new Error('Not authorized to access this route, token missing.'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      if (allowedModels && !allowedModels.includes(decoded.role)) {
        res.statusCode = 403;
        return next(new Error('Role unauthorized to access this module.'));
      }

      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      res.statusCode = 401;
      return next(new Error('Token expired or compromised.'));
    }
  };
};

module.exports = { protect };