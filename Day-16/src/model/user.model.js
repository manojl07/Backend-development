const { required } = require('joi')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: string,
  email: { type: String, unique: true },
  role: { type: String, default: "user" },
  password: { type: String, required: true },

  isVerified: { type: String, default: false },
  otp: String,
  otpExpiry: Date,

  resetOtp: String,
  resetOtpExpiry: Date,

  isResetOtpVerified: { type: String, default: false }
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)