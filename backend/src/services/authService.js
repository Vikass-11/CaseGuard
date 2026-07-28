const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";
const REFRESH_TOKEN_EXPIRES_IN = "30d";

class AuthService {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  generateRefreshToken(user) {
    const payload = {
      userId: user._id,
      email: user.email
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  async register(userData) {
    const { email, password, name, role, organization, phone } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await this.hashPassword(password);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: role || "complainant",
      organization,
      phone
    });

    await user.save();

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        phone: user.phone
      },
      token,
      refreshToken
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        phone: user.phone
      },
      token,
      refreshToken
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new Error("Invalid refresh token");
      }

      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}

module.exports = new AuthService();
