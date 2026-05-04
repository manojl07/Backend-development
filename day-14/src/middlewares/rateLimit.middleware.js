const rateLimit = require('express-rate-limit')

exports.loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

exports.forgotLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 3
});