"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTemplates = void 0;
const enums_1 = require("../enums");
exports.allTemplates = {
    [enums_1.EEmailActions.WELCOME]: {
        subject: "Great to see you in our app!",
        templateName: "register",
    },
    [enums_1.EEmailActions.CHANGE_TYPE_ACCOUNT]: {
        subject: "Only one step left to the premium account!",
        templateName: "changeTypeAccount",
    },
    [enums_1.EEmailActions.ADD_BRAND]: {
        subject: "Please add the following car brand.",
        templateName: "addBrand",
    },
    [enums_1.EEmailActions.ADD_MODEL]: {
        subject: "Please add the following car model.",
        templateName: "addModel",
    },
    [enums_1.EEmailActions.AD_VERIFICATION]: {
        subject: "Please check this ad for profanity!",
        templateName: "adVerification",
    },
};
