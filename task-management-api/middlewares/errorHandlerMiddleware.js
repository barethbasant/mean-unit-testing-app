const errorHandlerMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  console.log(err);

  res.status(status).json({ error: message, errors });
};

module.exports = errorHandlerMiddleware;
