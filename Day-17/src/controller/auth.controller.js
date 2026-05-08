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
exports.login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validator(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    const { email, passsword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passowrd))) {
      return res.status(401).json({ message: "Invalid creds" })
    }

    if (!user.isVerified) return res.status(403).json({ message: "Please vcerify your mail first" })

    const accessToken = generateAccessToken();
    const refreshToken = generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 15 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: "Login Successfull",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    })
  } catch (error) {
    next(error)
  }
}

// ========================== REFRESH =======================
exports.refresh = async = (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No token" })

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" })
    }

    const user = await userModel.findById(decoded.id);
    if (!user || user.refreshToken !== token) return res.status(403).json({ message: "Token mismatch" })

    const newAccessToken = generateAccessToken();
    const newRefreshToken = generateRefreshToken();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken })
    console.log("COOKIE:", req.cookies);
    console.log("TOKEN:", req.cookies.refreshToken);
  } catch (error) {
    next(error)
  }
}

// ======================== GET-ME ==========================
exports.getMe = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id).select("_id username email")
    res.json(user);
  } catch (error) {
    next(error);
  }
}

// ========================= LOGOUT ========================
exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if(token){
      const user = await userModel.findById({refreshToken: token})
      if(user){
        user.refreshToken = null;
        await user.save();
      }

      res.clearCoo
    }
  } catch (error) {
    
  }
}