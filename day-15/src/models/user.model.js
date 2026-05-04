const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  role: { type: String, default: "user" },
  password: { type: String, required: true }, 
  refreshToken: String,

  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,

  resetOtp: String,
  resetOtpExpires: Date,

  isResetOtpVerified: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model("userModel", userSchema);