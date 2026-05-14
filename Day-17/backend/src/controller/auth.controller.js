const userModel = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { registerSchema, loginSchema, verifyOtpSchema, resetPasswordSchema } = require('../utils/validator')
const { generateOtp } = require('../utils/generateOtp')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')
const { sendOtpEmail } = require('../utils/sendEmail')

// ============================ REGISTER ============================
exports.register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ email })
    if (existingUser) {

      if (!existingUser.isVerified) {
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10)

        existingUser.otp = hashedOtp;
        existingUser.otpExpiry = Date.now() + 5 * 60 * 1000

        await existingUser.save();
        await sendOtpEmail(email, otp);

        return res.status(200).json({ message: "Please verify OTP sent in mail." })
      }
      return res.status(409).json({ message: "User already exists!" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await userModel.create({
      username,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    })

    await sendOtpEmail(email, otp);

    res.status(201).json({ message: "OTP sent in mail. Please verify" })
  } catch (error) {
    next(error)
  }
}

// =========================== LOGIN ===========================
exports.login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    const { email, password } = req.body;

    console.log("BODY:", req.body);
    const user = await userModel.findOne({ email });
    console.log("USER:", user);

    // GPT
    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(401).json({
        message: "Invalid creds"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid creds"
      });
    }
    //END

    if (!user.isVerified) return res.status(403).json({ message: "Please verify your mail first" })

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: "Login Successfull",
      accessToken,
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
exports.refresh = async (req, res, next) => {
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

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })



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
    if (token) {
      const user = await userModel.findOne({ refreshToken: token })
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    res.json({
      message: "Logged out successfully"
    });
  } catch (error) {
    next(error)
  }
}

// ===================== VERIFY EMAIL OTP ===================
exports.verifyOtp = async (req, res, next) => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    const { email, otp } = req.body;

    const user = await userModel.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found!" })

    if (user.isVerified) return res.json({ message: "Already verified" })

    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!user.otp || !isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Account Verified Successfully" })

  } catch (error) {
    next(error)
  }
}

// ====================== FORGOT PASSWORD =======================
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) return res.status(404).json({
      message: "User not found"
    })

    if (!user.isVerified) return res.status(403).json({ message: "Account not Verified!" })

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.resetOtp = hashedOtp;
    user.resetOtpExpires = Date.now() + 5 * 60 * 1000

    await user.save();
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent in mail." })
  } catch (error) {
    next(error)
  }
}

// ======================= VERIFY RESET OTP ======================
exports.verifyResetOtp = async (req, res, next) => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || !user.resetOtp || !(await bcrypt.compare(otp, user.resetOtp))) {
      return res.status(403).json({ message: "Invalid OTP" })
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < Date.now()) {
      return res.status(403).json({ message: "OTP Expired." })
    }

    user.isResetOtpVerified = true;
    user.resetOtp = null;
    user.resetOtpExpires = null;

    await user.save();

    res.json({ message: "OTP verified successfully" })
  } catch (error) {
    next(error)
  }
}

// ====================== RESET PASSWORD ======================
exports.resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    const { email, newPassword } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) return res.status(404).json({ message: "User not found" })

    if (!user.isResetOtpVerified) return res.status(403).json({ message: "OTP not verified!" })

    if (!newPassword || newPassword.length < 6) {
      return res.status(403).json({ message: "Password must be at least 6 characters" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // clean ups's
    user.resetOtp = null;
    user.resetOtpExpires = null;
    user.isResetOtpVerified = false;

    // Logout all sessions
    user.refreshToken = null;

    await user.save();

    res.json({ message: "Password updated successfully!" })
  } catch (error) {
    next(error)
  }
}

// ====================== RESEND OTP =========================
exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" })

    if (user.isVerified) return res.status(400).json({ message: "User already verified" })

    // 🔐 generate new OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000

    await user.save();
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP re-sent successfully!" })
  } catch (error) {
    next(error)
  }
} 