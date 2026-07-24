"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = signUp;
exports.logIn = logIn;
exports.refresh = refresh;
exports.logout = logout;
exports.logoutAll = logoutAll;
exports.getCurrentUser = getCurrentUser;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.changePassword = changePassword;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const resend_1 = require("resend");
const user_model_1 = __importDefault(require("../models/user.model"));
const session_model_1 = __importDefault(require("../models/session.model"));
const passwordResetToken_model_1 = __importDefault(require("../models/passwordResetToken.model"));
const token_service_1 = require("../services/token.service");
const session_service_1 = require("../services/session.service");
const cookie_util_1 = require("../utils/cookie.util");
const JWT_SECRET = process.env.JWT_SECRET;
const resend = process.env.RESEND_API_KEY
    ? new resend_1.Resend(process.env.RESEND_API_KEY)
    : null;
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }
            if (password.length < 6) {
                return res
                    .status(400)
                    .json({ message: "Password must be at least 6 characters" });
            }
            const existingUser = yield user_model_1.default.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res
                    .status(409)
                    .json({ message: "Username or email already taken" });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = yield user_model_1.default.create({
                username,
                email,
                password: hashedPassword,
            });
            if (!user) {
                throw new Error("error saving data");
            }
            const { accessToken, refreshToken } = yield (0, token_service_1.generateTokens)(user.id);
            yield (0, session_service_1.createSession)(req, user.id, refreshToken);
            yield (0, cookie_util_1.setAuthCookie)(res, accessToken, refreshToken);
            res.status(201).json({
                message: "user added successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function logIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "invalid credentials" });
            }
            const user = yield user_model_1.default.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: "invalid credentials" });
            }
            const isMatched = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatched) {
                return res.status(400).json({ message: "invalid credentials" });
            }
            const { accessToken, refreshToken } = yield (0, token_service_1.generateTokens)(user.id);
            yield (0, session_service_1.createSession)(req, user.id, refreshToken);
            yield (0, cookie_util_1.setAuthCookie)(res, accessToken, refreshToken);
            res.status(201).json({
                message: "user logged in successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function refresh(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const incomingRefreshToken = req.cookies.refreshToken;
            if (!incomingRefreshToken) {
                return res.status(401).json({ message: "unauthorized" });
            }
            const payload = jsonwebtoken_1.default.verify(incomingRefreshToken, JWT_SECRET);
            //finding all tokens of same user of multiple devices
            const sessions = yield session_model_1.default.find({
                userId: payload.id,
            });
            if (!sessions.length) {
                return res.status(401).json({ message: "invalid session" });
            }
            let matchedSession = null;
            for (const session of sessions) {
                const isMatched = yield bcryptjs_1.default.compare(incomingRefreshToken, session.refreshToken);
                if (isMatched) {
                    matchedSession = session;
                    break;
                }
            }
            if (!matchedSession) {
                return res.status(403).json({ message: "invalid token" });
            }
            //deleting old token
            yield matchedSession.deleteOne();
            const { accessToken, refreshToken } = yield (0, token_service_1.generateTokens)(payload.id);
            yield (0, session_service_1.createSession)(req, payload.id, refreshToken);
            yield (0, cookie_util_1.setAuthCookie)(res, accessToken, refreshToken);
            console.log("Incoming refresh token:", !!req.cookies.refreshToken);
            console.log("Sessions found:", sessions.length);
            console.log("Matched session:", !!matchedSession);
            return res.status(200).json({
                message: "tokens refreshed successfully",
            });
        }
        catch (err) {
            return res.status(401).json({ message: "refresh unsuccessfull" });
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { accessToken, refreshToken } = req.cookies;
            if (!refreshToken) {
                return res.status(401).json({ message: "unautorized" });
            }
            const payload = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
            const sessions = yield session_model_1.default.find({ userId: payload.id });
            let matchedSession = null;
            for (const session of sessions) {
                const isMatched = yield bcryptjs_1.default.compare(refreshToken, session.refreshToken);
                if (isMatched) {
                    matchedSession = session;
                    break;
                }
            }
            if (!matchedSession) {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.status(401).json({
                    message: "session not found",
                });
            }
            yield matchedSession.deleteOne();
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(200).json({ message: "logout successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function logoutAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield session_model_1.default.deleteMany({
                userId: req.user.id,
            });
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(200).json({ message: "logout from all devices" });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function getCurrentUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findById(req.user.id).select("username email isPremium");
            if (!user) {
                return res.status(404).json({ message: "user not found" });
            }
            return res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isPremium: user.isPremium,
                },
            });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    message: "email is required",
                });
            }
            console.log(email);
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    message: "The user doesnt exist in dematch.",
                });
            }
            console.log("before delete many");
            // Only one active reset request per user
            yield passwordResetToken_model_1.default.deleteMany({
                userId: user._id,
            });
            const rawToken = crypto_1.default.randomBytes(32).toString("hex");
            const hashedToken = crypto_1.default
                .createHash("sha256")
                .update(rawToken)
                .digest("hex");
            console.log("before password reset token");
            yield passwordResetToken_model_1.default.create({
                userId: user._id,
                resetTokenHash: hashedToken,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            });
            const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
            console.log("before sending email");
            const resp = yield (resend === null || resend === void 0 ? void 0 : resend.emails.send({
                from: "DevMatch <noreply@devmatch.co.in>",
                to: email,
                subject: "Reset your DevMatch password",
                html: `
        <h2>Password Reset</h2>

        <p>Click the link below to reset your password.</p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>

        <p>If you didn't request this, simply ignore this email.</p>
      `,
            }));
            console.log("we are reaching till here");
            console.log(resp);
            return res.status(200).json({
                message: "If an account exists with this email, a reset link has been sent.",
            });
        }
        catch (err) {
            return res.status(500).json({
                message: "server error",
            });
        }
    });
}
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return res.status(400).json({
                    message: "Token and new password are required",
                });
            }
            if (newPassword.length < 6) {
                return res
                    .status(400)
                    .json({ message: "Password must be at least 6 characters" });
            }
            const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
            const resetToken = yield passwordResetToken_model_1.default.findOne({
                resetTokenHash: hashedToken,
            });
            if (!resetToken) {
                return res.status(400).json({
                    message: "Invalid or expired reset link",
                });
            }
            if (resetToken.expiresAt < new Date()) {
                yield passwordResetToken_model_1.default.deleteOne({
                    _id: resetToken._id,
                });
                return res.status(400).json({
                    message: "Reset link has expired",
                });
            }
            const user = yield user_model_1.default.findById(resetToken.userId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            user.password = yield bcryptjs_1.default.hash(newPassword, 10);
            yield user.save();
            // Delete the reset token so it cannot be reused
            yield passwordResetToken_model_1.default.deleteMany({
                _id: resetToken._id,
            });
            // Logout from all devices
            yield session_model_1.default.deleteMany({
                userId: user._id,
            });
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(200).json({
                message: "Password reset successful. Please login again.",
            });
        }
        catch (err) {
            return res.status(500).json({
                message: "Server Error",
            });
        }
    });
}
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    message: "Current password and new password are required",
                });
            }
            if (newPassword.length < 6) {
                return res
                    .status(400)
                    .json({ message: "Password must be at least 6 characters" });
            }
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Current password is incorrect",
                });
            }
            const isSamePassword = yield bcryptjs_1.default.compare(newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).json({
                    message: "New password must be different from the current password",
                });
            }
            user.password = yield bcryptjs_1.default.hash(newPassword, 10);
            yield user.save();
            yield session_model_1.default.deleteMany({
                userId: user._id,
            });
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(200).json({
                message: "Password changed successfully. Please login again.",
            });
        }
        catch (err) {
            return res.status(500).json({
                message: "Server Error",
            });
        }
    });
}
