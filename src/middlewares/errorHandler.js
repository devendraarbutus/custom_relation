// src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {

  console.error(err.stack); // Logger: stack trace
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
