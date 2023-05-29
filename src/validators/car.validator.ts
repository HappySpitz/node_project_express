import Joi from "joi";
import {EBrands, ECurrency, EModels, ERegions, ETypesCar} from "../enums";

export class CarValidator {
    private static type = Joi.valid(...Object.values(ETypesCar));
    private static text = Joi.string().min(2).max(1000).trim().lowercase();
    private static brand = Joi.valid(...Object.values(EBrands));
    private static model = Joi.valid(...Object.values(EModels));
    private static color = Joi.string().min(2).max(25).trim().lowercase();
    private static region = Joi.valid(...Object.values(ERegions));
    private static year = Joi.number().min(1990).max(new Date().getFullYear());
    private static price = Joi.number().min(0).max(100000000);
    private static currency = Joi.valid(...Object.values(ECurrency));

    static create = Joi.object({
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

    static update = Joi.object({
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

    static addValue = Joi.object({
        brand: this.brand,
        model: this.model
    })
}