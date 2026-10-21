const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for developer
  console.error(err);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    error.message = 'Resource not found invalid ID format.';
    res.statusCode = 404;
  }

  // Mongoose Duplicate Key Error (e.g., Email already exists)
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered.';
    res.statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    res.statusCode = 400;
  }

  res.status(res.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;