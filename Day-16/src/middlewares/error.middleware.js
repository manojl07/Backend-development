exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.staus(err.stack || 500).json({
    success: false,
    message: err.message || "Internal Server Error!!!"
  })
}