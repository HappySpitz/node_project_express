"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const Joi = __importStar(require("joi"));
const constants_1 = require("../constants");
const enums_1 = require("../enums");
class UserValidator {
    static firstName = Joi.string().min(2).max(50).trim();
    static lastName = Joi.string().min(2).max(50).trim();
    static email = Joi.string()
        .regex(constants_1.regexConstants.EMAIL)
        .lowercase()
        .trim();
    static password = Joi.string().regex(constants_1.regexConstants.PASSWORD);
    static phone = Joi.string().regex(constants_1.regexConstants.PHONE);
    static type = Joi.valid(...Object.values(enums_1.ETypesSeller));
    static createSeller = Joi.object({
        name: this.firstName.required(),
        lastName: this.lastName.required(),
        email: this.email.required(),
        password: this.password.required(),
        type: this.type,
        phone: this.phone.required(),
    });
    static createManager = Joi.object({
        name: this.firstName.required(),
        email: this.email.required(),
        password: this.password.required(),
    });
    static update = Joi.object({
        name: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        email: this.email,
        password: this.password,
        type: this.type,
    });
    static login = Joi.object({
        email: this.email.required(),
        password: this.password.required(),
    });
    static emailValidator = Joi.object({
        email: this.email.required(),
    });
}
exports.UserValidator = UserValidator;
