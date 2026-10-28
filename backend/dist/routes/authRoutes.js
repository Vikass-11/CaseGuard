"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
// Authenticated user endpoints
router.put('/change-password', authMiddleware_1.protect, authController_1.changePassword);
router.get('/me', authMiddleware_1.protect, authController_1.getMe);
router.put('/profile', authMiddleware_1.protect, authController_1.updateProfile);
exports.default = router;
