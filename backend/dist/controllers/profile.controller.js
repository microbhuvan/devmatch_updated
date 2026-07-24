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
exports.createProfile = createProfile;
exports.getMyProfile = getMyProfile;
exports.getUserProfile = getUserProfile;
exports.editProfile = editProfile;
exports.updateProfilePhoto = updateProfilePhoto;
const profile_model_1 = __importDefault(require("../models/profile.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const profile_validator_1 = require("../validators/profile.validator");
const cloudinary_service_1 = require("../services/cloudinary.service");
function createProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { skills, age, gender, about, github, linkedin } = req.body;
            const profileExists = yield profile_model_1.default.findOne({
                userId: req.user.id,
            });
            if (profileExists) {
                return res.status(409).json({ message: "profile already exists" });
            }
            const profile = yield profile_model_1.default.create({
                userId: req.user.id,
                skills,
                age,
                gender,
                about,
                github,
                linkedin,
            });
            return res.status(201).json({
                message: "profile created successfully",
                profile,
            });
        }
        catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "server error" });
        }
    });
}
function getMyProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const profile = yield profile_model_1.default.findOne({ userId: userId });
            if (!profile) {
                return res.status(404).json({ message: "profile doesnt exist" });
            }
            return res.status(200).json({
                message: "profile data",
                profile,
            });
        }
        catch (err) {
            console.log(err.message);
            res.status(500).json({ message: "server error" });
        }
    });
}
function getUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username } = req.params;
            if (!username) {
                return res.status(400).json({ message: "invalid username format" });
            }
            const user = yield user_model_1.default.findOne({ username: username });
            if (!user) {
                return res.status(404).json({ message: "user doesnt exist" });
            }
            const profile = yield profile_model_1.default.findOne({ userId: user === null || user === void 0 ? void 0 : user.id });
            if (!profile) {
                return res.status(404).json({ message: "profile doesnt exist" });
            }
            return res.status(200).json({
                message: "profile data",
                profile,
            });
        }
        catch (err) {
            console.log(err.message);
            res.status(500).json({ message: "server error" });
        }
    });
}
function editProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updates = Object.keys(req.body);
            let isValid = (0, profile_validator_1.validateProfile)(updates);
            if (!isValid) {
                return res.status(400).json({ message: "invalid input fields" });
            }
            const profile = yield profile_model_1.default.findOneAndUpdate({ userId: req.user.id }, req.body, {
                new: true,
                runValidators: true,
            });
            if (!profile) {
                return res.status(404).json({ message: "profile doesnt exist" });
            }
            return res
                .status(200)
                .json({ message: "changes successfully saved", profile });
        }
        catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "server error" });
        }
    });
}
function updateProfilePhoto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.file || !req.file.buffer) {
                return res.status(400).json({ message: "Photo is required" });
            }
            const profile = yield profile_model_1.default.findOne({ userId: req.user.id });
            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }
            if (profile.photoPublicId) {
                yield (0, cloudinary_service_1.deleteImage)(profile.photoPublicId);
            }
            const result = yield (0, cloudinary_service_1.imageUpload)(req.file.buffer);
            profile.photoURL = result.url;
            profile.photoPublicId = result.publicId;
            yield profile.save();
            return res.status(200).json({
                message: "Photo updated successfully",
                profile,
            });
        }
        catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "Server error",
            });
        }
    });
}
//missing projection and using virtual both in getUserProfile
