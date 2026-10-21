const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const sendEmail = require("../utils/sendEmail.js");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    if (!fullName || !email || !phone || !password) {
      res.statusCode = 400;
      return next(new Error("All fields are required."));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.statusCode = 400;
      return next(new Error("An account with this email already exists."));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: role || "patient",
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.statusCode = 400;
      return next(new Error("Email and password are required."));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.statusCode = 401;
      return next(new Error("Invalid credentials."));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.statusCode = 401;
      return next(new Error("Invalid credentials."));
    }

    if (role && user.role !== role) {
      res.statusCode = 403;
      return next(new Error("Role mismatch. Please select the correct role."));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.statusCode = 400;
      return next(new Error("Email is required."));
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether the email exists — respond the same way either way
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email, an OTP has been sent.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 minutes
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your MediCare+ Password Reset OTP",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color: #0ea5e9;">MediCare+ Hospital</h2>
          <p>Hi ${user.fullName},</p>
          <p>Your OTP to reset your password is:</p>
          <h1 style="letter-spacing: 4px; color: #1e293b;">${otp}</h1>
          <p>This code is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "If an account exists with this email, an OTP has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.statusCode = 400;
      return next(new Error("Email and OTP are required."));
    }

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry) {
      res.statusCode = 400;
      return next(new Error("Invalid or expired OTP request."));
    }

    if (user.otp !== otp) {
      res.statusCode = 400;
      return next(new Error("Incorrect OTP."));
    }

    if (user.otpExpiry < new Date()) {
      res.statusCode = 400;
      return next(new Error("OTP has expired. Please request a new one."));
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      res.statusCode = 400;
      return next(new Error("Reset token and new password are required."));
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_ACCESS_SECRET);
    } catch {
      res.statusCode = 401;
      return next(new Error("Reset link has expired. Please request a new OTP."));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      res.statusCode = 404;
      return next(new Error("User not found."));
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.statusCode = 401;
      return next(new Error("Refresh token missing."));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      res.statusCode = 401;
      return next(new Error("User not found."));
    }

    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    res.statusCode = 401;
    next(new Error("Invalid or expired refresh token."));
  }
};