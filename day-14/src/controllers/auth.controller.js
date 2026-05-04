const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { registerSchema, loginSchema } = require('../utils/validators');
const { generateOtp } = require('../utils/generateOtp');
const { sendOtpEmail } = require('../utils/sendEmail');
const { verifyOtpSchema } = require('../utils/validators');
const { resetPasswordSchema } = require('../utils/validators');


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000
    });

    await sendOtpEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to email. Please verify."
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first"
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// ================= REFRESH =================
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No token" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    return res.status(403).json({ message: "Token mismatch" });
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken: newAccessToken });
};


// ================= GET-ME =================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("username email _id");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= LOGOUT =================
exports.logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ message: "Logged out" });
};


// ================= VERIFY EMAIL OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.json({ message: "Already verified" });
    }

    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (!user.otp || !(await bcrypt.compare(otp, user.otp))) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Account verified successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Account not verified" });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.resetOtp = hashedOtp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= VERIFY RESET OTP =================
exports.verifyResetOtp = async (req, res) => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.resetOtp || !(await bcrypt.compare(otp, user.resetOtp))) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isResetOtpVerified = true;
    await user.save();

    res.json({ message: "OTP verified" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isResetOtpVerified) {
      return res.status(403).json({ message: "OTP not verified" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // cleanup
    user.resetOtp = null;
    user.resetOtpExpires = null;
    user.isResetOtpVerified = false;

    // logout all sessions
    user.refreshToken = null;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
