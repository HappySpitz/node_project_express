"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enums_1 = require("../enums");
class CarValidator {
    static type = joi_1.default.valid(...Object.values(enums_1.ETypesCar));
    static text = joi_1.default.string().min(2).max(1000).trim().lowercase();
    static brand = joi_1.default.valid(...Object.values(enums_1.EBrands));
    static model = joi_1.default.valid(...Object.values(enums_1.EModels));
    static color = joi_1.default.string().min(2).max(25).trim().lowercase();
    static region = joi_1.default.valid(...Object.values(enums_1.ERegions));
    static year = joi_1.default.number().min(1990).max(new Date().getFullYear());
    static price = joi_1.default.number().min(0).max(100000000);
    static currency = joi_1.default.valid(...Object.values(enums_1.ECurrency));
    static create = joi_1.default.object({
        type: this.type.required(),
        brand: this.brand.required(),
        model: this.model.required(),
        color: this.color.required(),
        region: this.region.required(),
        text: this.text.required(),
        price: this.price.required(),
        currency: this.currency.required(),
        year: this.year.required(),
    });
    static update = joi_1.default.object({
        type: this.type,
        brand: this.brand,
        model: this.model,
        color: this.color,
        region: this.region,
        text: this.text,
        price: this.price,
        currency: this.currency,
        year: this.year,
    });
    static addValue = joi_1.default.object({
        brand: this.brand,
        model: this.model
    });
}
exports.CarValidator = CarValidator;
