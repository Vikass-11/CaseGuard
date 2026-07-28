const authService = require("../services/authService");

class AuthController {
  async register(req, res) {
    try {
      const { email, password, name, role, organization, phone } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Email, password, and name are required"
        });
      }

      const result = await authService.register({
        email,
        password,
        name,
        role,
        organization,
        phone
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required"
        });
      }

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required"
        });
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async logout(req, res) {
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  }

  async getProfile(req, res) {
    try {
      const user = req.user;

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          organization: user.organization,
          phone: user.phone,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch profile"
      });
    }
  }
}

module.exports = new AuthController();
