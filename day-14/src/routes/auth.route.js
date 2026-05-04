const express = require('express')
const router = express.Router();

const auth = require('../controllers/auth.controller')
const { verifyAccessToken } = require('../middlewares/auth.middleware')
const { loginLimiter, forgotLimiter  } = require('../middlewares/rateLimit.middleware')

// ================= AUTH =================
router.post("/register", auth.register);
router.post("/login", loginLimiter, auth.login);
router.post("/refresh", auth.refreshToken);
router.get("/me", verifyAccessToken, auth.getMe);
router.post("/logout", auth.logout);

// ================= EMAIL VERIFY =================
router.post("/verify-otp", auth.verifyOtp);

// ================= PASSWORD RESET =================
router.post("/forgot-password", forgotLimiter, auth.forgotPassword);
router.post("/verify-reset-otp", auth.verifyResetOtp);   // ✅ ADD THIS
router.post("/reset-password", auth.resetPassword);      // ✅ ADD THIS

module.exports = router;