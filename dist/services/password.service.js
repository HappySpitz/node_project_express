"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordService {
    async hash(password) {
        return bcrypt_1.default.hash(password, 10);
    }
    async compare(password, hashPassword) {
        return bcrypt_1.default.compare(password, hashPassword);
    }
}
exports.passwordService = new PasswordService();
