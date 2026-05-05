const express = require('express')
const router = express.Router();

const auth = require('../controllers/auth.controller')
const {verifyAccessToken} = require('../middlewares/auth.middleware')

const {
  loginLimiter,
  otpLimiter,
  forgotPasswordLimiter
} = require('../middlewares/ratelimit.middleware')

// ================ AUTH ====================
router.post('/register', otpLimiter, auth.register)
router.post('/login', loginLimiter, auth.login)
router.post('/refresh', auth.refresh)
router.get('/me', verifyAccessToken, auth.getMe)
router.post('/logout', auth.logout)
router.post('/resend-otp', auth.resendOtp)

// ================= EMAIL VERIFY ================
router.post("/verify-otp", otpLimiter, auth.verifyOtp)

// ================= PASSWORD RESET ================
router.post('/forgot-password', forgotPasswordLimiter, auth.forgotPassword)
router.post('/verify-reset-otp', otpLimiter, auth.verifyResetOtp)
router.post('/reset-password', auth.resetPassword);

module.exports = router;