const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return;
  }

  let statusCode = 500;
  let message = 'Server Error';

  if (err) {
    if (err.statusCode) {
      statusCode = err.statusCode;
    }
    
    if (err.message) {
      message = err.message;
    }

    if (err.name === 'CastError') {
      message = 'Resource not found';
      statusCode = 404;
    }

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      message = field 
        ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
        : 'Duplicate entry';
      statusCode = 400;
    }

    if (err.name === 'ValidationError') {
      message = Object.values(err.errors || {}).map(val => val.message).join(', ') || 'Validation error';
      statusCode = 400;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && err && { stack: err.stack }),
  });
};

module.exports = errorHandler;

