const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (next && typeof next === 'function') {
        next(err);
      } else {
        console.error('Error in asyncHandler - next is not a function:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Internal server error',
          });
        }
      }
    });
  };
};

module.exports = asyncHandler;

