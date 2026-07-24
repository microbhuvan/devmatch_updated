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
exports.searchDevelopers = searchDevelopers;
const user_model_1 = __importDefault(require("../models/user.model"));
const profile_model_1 = __importDefault(require("../models/profile.model"));
function searchDevelopers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUser = yield user_model_1.default.findById(req.user.id);
            if (!currentUser) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            if (!currentUser.isPremium) {
                return res.status(403).json({
                    message: "Upgrade to Premium to use Developer Search.",
                });
            }
            const query = String(req.query.query || "").trim();
            if (!query) {
                return res.status(400).json({
                    message: "Search query is required.",
                });
            }
            // Search by skills
            const profiles = yield profile_model_1.default.find({
                userId: {
                    $ne: currentUser._id,
                },
                skills: {
                    $regex: query,
                    $options: "i",
                },
            }).populate("userId", "username email");
            // Search users by username
            const users = yield user_model_1.default.find({
                _id: {
                    $ne: currentUser._id,
                },
                username: {
                    $regex: query,
                    $options: "i",
                },
            }).select("_id username email");
            const userIds = users.map((user) => user._id);
            // Fetch matching profiles
            const usernameProfiles = yield profile_model_1.default.find({
                userId: {
                    $in: userIds,
                },
            }).populate("userId", "username email");
            // Remove duplicates
            const uniqueProfiles = new Map();
            [...profiles, ...usernameProfiles].forEach((profile) => {
                uniqueProfiles.set(profile.userId.toString(), profile);
            });
            return res.status(200).json({
                profiles: [...uniqueProfiles.values()],
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Unable to search developers.",
            });
        }
    });
}
