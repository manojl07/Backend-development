const userModel = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { registerSchema, loginSchema, verifyOtpSchema, resentPasswordSchema } = require('../utils/validator')
const { generateOtp } = require('../utils/generateOtp')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')
const { sendOtpEmail } = require('../utils/sendEmail')

// ============================ REGISTER ============================
exports.register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    const existingUser = await userModel.findOne({ email })
    if (existingUser) {

      if (!existingUser.isVErified) {
        const otp = generateOtp();
        const hashedOtp = await bcrypt(otp, 10)

        existingUser.otp = hashedOtp;
        existingUser.otpExpiry = Date.now() + 5 * 60 * 1000

        await existingUser.save();
        await sendOtpEmail();

        return res.status(200).json({ message: "Please verify OTP sent in mail." })
      }
      return res.status(409).json({ message: "User already exists!" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await sendOtpEmail();

    res.status(201).json({ message: "OTP sent in mail. Please verify" })
  } catch (error) {
    next(error)
  }
}

// =========================== LOGIN ===========================
