const rateLimit = require("express-rate-limit");

// 🔐 Login limiter
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // 5 attempts
  message: {
    message: "Too many login attempts. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 📩 OTP limiter
exports.otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many OTP requests. Please wait."
  },
});

// 🔁 Forgot password limiter
exports.forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    message: "Too many password reset requests."
  },
});