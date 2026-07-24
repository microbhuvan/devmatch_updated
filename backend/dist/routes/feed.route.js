"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const feedRouter = express_1.default.Router();
feedRouter.use(rateLimiter_1.apiLimiter);
const feed_controller_1 = require("../controllers/feed.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
feedRouter.get("/", auth_middleware_1.authMiddleware, feed_controller_1.getFeed);
exports.default = feedRouter;
