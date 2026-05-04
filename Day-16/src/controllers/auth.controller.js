const user = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { registerSchema, loginSchema, VerifyOtpSchema, resetPasswordSchema } = require('../utils/validator')
const { generateOtp } = require('../utils/generateOtp')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')
const { sendOtpEmail } = require('../utils/sendEmail')
const userModel = require('../model/user.model')
const { exist } = require('joi')


// ================ REGISTER==============
exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body)
    if (error) {
      res.status(400).json({ message: error.details[0].message })
    }

    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      if (!existingUser.isVerified) {
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10)

        existingUser.otp = hashedOtp;
        existingUser.otpExpiry = Date.now() + 5 * 60 * 1000;

        await existingUser.save();
        await sendOtpEmail(email, otp);

        return res.status(200).json({ message: "Please verify OTP sent in mail." })
      }

      return res.status(409).json({ message: "User already exists!" })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await userModel.create({
      username,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000
    })

    await sendOtpEmail(email, otp);

    res.status(201).json({ message: "OTP sent to mail. Please verify" })
  } catch (error) {
    next(error);
  }
}

// ================= LOGIN ===============
exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body)
    if (error) {
      res.status(400).json({ message: error.details[0].message })
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email })
    if(!user || !(await bcrypt.compare(password, user.password))){
      return res.status(401).json({message: "Invalid creds"})
    }

    if(!user.isVerified){
      return res.status(403).json({message: "Please verify your email first"})
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    user.refreshToken = refreshToken
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: "Login successfull",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    next(error);
  }
}

// ================= REFRESH =============
exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if(!token) return res.status(403).json({message: "No token!"})
    
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.RFRESH_TOKEN_SECRET)
    } catch (error) {
      return res.status(403).json({message: "Token mismatch"})
    }

    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({accessToken: newAccessToken})
  } catch (error) {
    next(error)
  }
}