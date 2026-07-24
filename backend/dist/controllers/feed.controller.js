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
exports.getFeed = getFeed;
const ConnectionRequest_model_1 = __importDefault(require("../models/ConnectionRequest.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
function getFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Math.min(Number(req.query.limit) || 10, 50);
            const skip = (page - 1) * limit;
            const requests = yield ConnectionRequest_model_1.default.find({
                $or: [
                    { fromUserId: req.user.id },
                    { toUserId: req.user.id },
                ],
            });
            const excludedIds = new Set([req.user.id]);
            for (const request of requests) {
                excludedIds.add(request.toUserId.toString());
                excludedIds.add(request.fromUserId.toString());
            }
            const users = yield user_model_1.default.find({
                _id: {
                    $nin: [...excludedIds],
                },
            })
                .select("username")
                .populate({
                path: "profile",
                select: "photoURL about skills github linkedin",
            })
                .skip(skip)
                .limit(limit);
            return res.status(200).json({
                page,
                limit,
                count: users.length,
                users,
            });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
