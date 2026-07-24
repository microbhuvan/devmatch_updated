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
exports.sendRequest = sendRequest;
exports.sentRequests = sentRequests;
exports.receivedRequests = receivedRequests;
exports.acceptRequest = acceptRequest;
exports.rejectRequest = rejectRequest;
exports.connections = connections;
exports.ignoreUser = ignoreUser;
exports.cancelRequest = cancelRequest;
exports.removeConnection = removeConnection;
const ConnectionRequest_model_1 = __importDefault(require("../models/ConnectionRequest.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
function sendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ message: "invalid url format" });
            }
            if (userId === req.user.id) {
                return res
                    .status(400)
                    .json({ message: "cannot send connection to yourself" });
            }
            const toUser = yield user_model_1.default.findById(userId);
            if (!toUser) {
                return res.status(404).json({ message: "user does not exist" });
            }
            const existingRequest = yield ConnectionRequest_model_1.default.findOne({
                $or: [
                    {
                        fromUserId: req.user.id,
                        toUserId: userId,
                    },
                    {
                        fromUserId: userId,
                        toUserId: req.user.id,
                    },
                ],
                status: {
                    $in: ["interested", "accepted"],
                },
            });
            if (existingRequest && existingRequest.status == "interested") {
                return res.status(409).json({ message: "request already exists" });
            }
            if (existingRequest && existingRequest.status == "accepted") {
                return res.status(409).json({ message: "request already accepted" });
            }
            const request = yield ConnectionRequest_model_1.default.create({
                fromUserId: req.user.id,
                toUserId: userId,
                status: "interested",
            });
            return res.status(201).json({ message: "connection created", request });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function sentRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requests = yield ConnectionRequest_model_1.default.find({
                fromUserId: req.user.id,
                status: "interested",
            }).populate({
                path: "toUserId",
                select: "username email",
                populate: {
                    path: "profile",
                    select: "photoURL about skills",
                },
            });
            if (requests.length === 0) {
                return res
                    .status(200)
                    .json({ message: "no pending sent requests", requests: [] });
            }
            return res
                .status(200)
                .json({ message: "existing pending sent requests", requests });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function receivedRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requests = yield ConnectionRequest_model_1.default.find({
                toUserId: req.user.id,
                status: "interested",
            }).populate({
                path: "fromUserId",
                select: "username email",
                populate: {
                    path: "profile",
                    select: "photoURL about skills",
                },
            });
            if (requests.length === 0) {
                return res
                    .status(200)
                    .json({ message: "no pending sent requests", requests: [] });
            }
            return res
                .status(200)
                .json({ message: "existing pending sent requests", requests });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function acceptRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { requestId } = req.params;
            const request = yield ConnectionRequest_model_1.default.findById(requestId);
            if (!request) {
                return res.status(404).json({ message: "request not found" });
            }
            if (request.toUserId.toString() !== req.user.id) {
                return res.status(403).json({ message: "forbidden request" });
            }
            request.status = "accepted";
            yield request.save();
            return res
                .status(200)
                .json({ message: "connection established successfully", request });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function rejectRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { requestId } = req.params;
            const request = yield ConnectionRequest_model_1.default.findById(requestId);
            if (!request) {
                return res.status(404).json({ message: "request not found" });
            }
            if (request.toUserId.toString() !== req.user.id) {
                return res.status(403).json({ message: "forbidden request" });
            }
            request.status = "rejected";
            yield request.save();
            return res.status(200).json({ message: "connection rejected", request });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function connections(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connections = yield ConnectionRequest_model_1.default.find({
                $or: [{ toUserId: req.user.id }, { fromUserId: req.user.id }],
                status: "accepted",
            })
                .populate({
                path: "fromUserId",
                select: "username email",
                populate: {
                    path: "profile",
                    select: "photoURL about skills",
                },
            })
                .populate({
                path: "toUserId",
                select: "username email",
                populate: {
                    path: "profile",
                    select: "photoURL about skills",
                },
            });
            if (connections.length === 0) {
                return res
                    .status(200)
                    .json({ message: "no connections exists", connections: [] });
            }
            return res
                .status(200)
                .json({ message: "all connections fetched", connections });
        }
        catch (err) {
            return res.status(500).json({ message: "server error" });
        }
    });
}
function ignoreUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({
                    message: "Invalid URL format",
                });
            }
            if (userId === req.user.id) {
                return res.status(400).json({
                    message: "Cannot ignore yourself",
                });
            }
            const toUser = yield user_model_1.default.findById(userId);
            if (!toUser) {
                return res.status(404).json({
                    message: "User does not exist",
                });
            }
            const existingRequest = yield ConnectionRequest_model_1.default.findOne({
                $or: [
                    {
                        fromUserId: req.user.id,
                        toUserId: userId,
                    },
                    {
                        fromUserId: userId,
                        toUserId: req.user.id,
                    },
                ],
                status: {
                    $in: ["interested", "accepted"],
                },
            });
            if (existingRequest) {
                return res.status(409).json({
                    message: "Connection already exists",
                });
            }
            const ignoredRequest = yield ConnectionRequest_model_1.default.create({
                fromUserId: req.user.id,
                toUserId: userId,
                status: "ignored",
            });
            return res.status(201).json({
                message: "User ignored successfully",
                request: ignoredRequest,
            });
        }
        catch (err) {
            return res.status(500).json({
                message: "Server error",
            });
        }
    });
}
function cancelRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { requestId } = req.params;
            const request = yield ConnectionRequest_model_1.default.findById(requestId);
            if (!request) {
                return res.status(404).json({
                    message: "Request not found",
                });
            }
            if (request.fromUserId.toString() !== req.user.id) {
                return res.status(403).json({
                    message: "Forbidden",
                });
            }
            if (request.status !== "interested") {
                return res.status(400).json({
                    message: "Only pending requests can be cancelled",
                });
            }
            yield request.deleteOne();
            return res.status(200).json({
                message: "Request cancelled successfully",
            });
        }
        catch (err) {
            return res.status(500).json({
                message: "Server error",
            });
        }
    });
}
function removeConnection(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUserId = req.user.id;
            const otherUserId = req.params.userId;
            const connection = yield ConnectionRequest_model_1.default.findOneAndDelete({
                $or: [
                    {
                        fromUserId: currentUserId,
                        toUserId: otherUserId,
                    },
                    {
                        fromUserId: otherUserId,
                        toUserId: currentUserId,
                    },
                ],
                status: "accepted",
            });
            if (!connection) {
                return res.status(404).json({
                    message: "Connection not found",
                });
            }
            return res.status(200).json({
                message: "Connection removed successfully",
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Server error",
            });
        }
    });
}
