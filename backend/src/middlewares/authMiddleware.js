const authService = require("../services/authService");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required"
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = authService.verifyToken(token);
      
      const user = await User.findById(decoded.userId).select("-password");
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: "User not found or account is deactivated"
        });
      }

      req.user = user;
      req.userId = decoded.userId;
      req.userRole = decoded.role;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error"
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions"
      });
    }

    next();
  };
};

module.exports = authMiddleware;
module.exports.requireRole = requireRole;
