 // Custom Error Class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global Error Handling Middleware
export const errorHandler = (err, req, res, next) => {
  console.error('SERVER ERROR LOG:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle MongoDB CastError (Invalid ID)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID format';
  }

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Resource already exists';
  }

  // Strip generic internal server error details in production unless it's a known operational AppError
  if (process.env.NODE_ENV === 'production' && !err.isOperational && statusCode === 500) {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Strictly strip stack traces outside development
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};