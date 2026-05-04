const rateLimit = require('express-rate-limit')

// 🔐 Login limiter
exports.loginLimiter = rateLimit({
  WindowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login requests!"
  },
  legacyHeaders: false,
  standardHeaders: true,
})

// 📩 OTP limiter
exports.otpLimiter = rateLimit({
  WindowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many OTP requests. Please wait!"
  },
})

// 🔁 Forgot password limiter
exports.forgotpasswordLimiter = rateLimit({
  WindowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    message: "Too many password reset requests!"
  },
})

