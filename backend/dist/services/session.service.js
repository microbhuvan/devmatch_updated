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
exports.createSession = createSession;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const session_model_1 = __importDefault(require("../models/session.model"));
function createSession(req, userId, refreshToken, userAgent, ipAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedRefreshToken = yield bcryptjs_1.default.hash(refreshToken, 10);
        yield session_model_1.default.create({
            userId,
            refreshToken: hashedRefreshToken,
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
    });
}
