"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileRouter = express_1.default.Router();
const rateLimiter_1 = require("../middlewares/rateLimiter");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const profile_controller_1 = require("../controllers/profile.controller");
profileRouter.use(rateLimiter_1.apiLimiter);
profileRouter.post("/", auth_middleware_1.authMiddleware, profile_controller_1.createProfile);
profileRouter.get("/me", auth_middleware_1.authMiddleware, profile_controller_1.getMyProfile);
profileRouter.get("/:username", auth_middleware_1.authMiddleware, profile_controller_1.getUserProfile);
profileRouter.patch("/", auth_middleware_1.authMiddleware, profile_controller_1.editProfile);
profileRouter.patch("/photo", auth_middleware_1.authMiddleware, upload_middleware_1.default.single("photo"), profile_controller_1.updateProfilePhoto);
exports.default = profileRouter;
