"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequestFields = void 0;
exports.validateFields = validateFields;
exports.sendRequestFields = ["interested", "ignored"];
function validateFields(status) {
    return exports.sendRequestFields.includes(status);
}
