"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileAllowedFields = void 0;
exports.validateProfile = validateProfile;
exports.profileAllowedFields = [
    "skills",
    "age",
    "gender",
    "about",
    "github",
    "linkedin",
    "photoURL",
];
function validateProfile(updates) {
    return updates.every((field) => exports.profileAllowedFields.includes(field));
}
