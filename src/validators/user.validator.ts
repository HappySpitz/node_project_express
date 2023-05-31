import * as Joi from "joi";

import { regexConstants } from "../constants";
import { ETypesSeller } from "../enums";

export class UserValidator {
  private static firstName = Joi.string().min(2).max(50).trim();
  private static lastName = Joi.string().min(2).max(50).trim();
  private static email = Joi.string()
    .regex(regexConstants.EMAIL)
    .lowercase()
    .trim();
  private static password = Joi.string().regex(regexConstants.PASSWORD);
  private static phone = Joi.string().regex(regexConstants.PHONE);
  private static type = Joi.valid(...Object.values(ETypesSeller));

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
